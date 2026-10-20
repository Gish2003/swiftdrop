import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ERROR_CODES, type ApiErrorBody } from '@swiftdrop/contracts';
import { Prisma } from '@swiftdrop/db';
import type { Request, Response } from 'express';
import { AppError } from '../errors/app-error';

const STATUS_TO_CODE: Record<number, string> = {
  400: ERROR_CODES.VALIDATION_FAILED,
  401: ERROR_CODES.UNAUTHENTICATED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  409: ERROR_CODES.CONFLICT,
  429: ERROR_CODES.RATE_LIMITED,
  501: ERROR_CODES.NOT_IMPLEMENTED,
};

/** Single place that shapes every error response. Never leaks stack traces or internals. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request & { id?: string }>();
    if (res.headersSent) return;

    const { status, body } = this.toBody(exception);
    body.error.requestId = req.id;

    if (status >= 500) this.logger.error(exception instanceof Error ? exception.stack : exception);
    res.status(status).json(body);
  }

  private toBody(exception: unknown): { status: number; body: ApiErrorBody } {
    if (exception instanceof AppError) {
      return {
        status: exception.getStatus(),
        body: {
          error: { code: exception.code, message: exception.message, details: exception.details },
        },
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as string | { message?: string | string[] };
      const raw = typeof response === 'string' ? response : response.message;
      const isValidation = status === 400 && Array.isArray(raw);
      return {
        status,
        body: {
          error: {
            code:
              STATUS_TO_CODE[status] ?? (status >= 500 ? ERROR_CODES.INTERNAL_ERROR : 'HTTP_ERROR'),
            message: isValidation ? 'Request validation failed' : String(raw ?? exception.message),
            details: isValidation ? raw : undefined,
          },
        },
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return {
          status: HttpStatus.CONFLICT,
          body: { error: { code: ERROR_CODES.CONFLICT, message: 'Resource already exists' } },
        };
      }
      if (exception.code === 'P2025') {
        return {
          status: HttpStatus.NOT_FOUND,
          body: { error: { code: ERROR_CODES.NOT_FOUND, message: 'Resource not found' } },
        };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { error: { code: ERROR_CODES.INTERNAL_ERROR, message: 'Something went wrong' } },
    };
  }
}
