import type { ApiErrorBody } from '@swiftdrop/contracts';

/** Human-readable message from an API error body (see docs/conventions/errors.md). */
export function errorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const body = error as Partial<ApiErrorBody> | undefined;
  return body?.error?.message ?? fallback;
}

export function errorCode(error: unknown): string | undefined {
  return (error as Partial<ApiErrorBody> | undefined)?.error?.code;
}
