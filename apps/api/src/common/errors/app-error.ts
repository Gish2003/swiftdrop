import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES, type ErrorCode } from '@swiftdrop/contracts';

/**
 * Throw this for every expected business error. The global filter turns it into
 * `{ error: { code, message, details, requestId } }`. See docs/conventions/errors.md.
 *
 *   throw new AppError('INVALID_STATUS_TRANSITION', 'Cannot go from CREATED to DELIVERED', 409);
 */
export class AppError extends HttpException {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details?: unknown,
  ) {
    super({ code, message, details }, status);
  }
}

export const notFound = (what: string) =>
  new AppError(ERROR_CODES.NOT_FOUND, `${what} not found`, HttpStatus.NOT_FOUND);

export const forbidden = (message = 'You do not have access to this resource') =>
  new AppError(ERROR_CODES.FORBIDDEN, message, HttpStatus.FORBIDDEN);

/** Used by scaffold stubs. Remove the call when you implement the endpoint. */
export function notImplemented(owner: string): never {
  throw new AppError(
    ERROR_CODES.NOT_IMPLEMENTED,
    `Not implemented yet (owner: ${owner}). See docs/members/.`,
    HttpStatus.NOT_IMPLEMENTED,
  );
}
