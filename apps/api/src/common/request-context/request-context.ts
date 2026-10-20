import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { CORRELATION_ID_HEADER } from '@swiftdrop/contracts';
import type { NextFunction, Request, Response } from 'express';

interface RequestContextStore {
  requestId: string;
}

const storage = new AsyncLocalStorage<RequestContextStore>();

/** Per-request context (correlation id). Use `RequestContext.correlationId()` when building events. */
export const RequestContext = {
  run<T>(store: RequestContextStore, fn: () => T): T {
    return storage.run(store, fn);
  },
  /** Correlation id for the current request, or a fresh one outside a request. */
  correlationId(): string {
    return storage.getStore()?.requestId ?? randomUUID();
  },
};

/** Express middleware: accepts an incoming X-Request-Id or creates one, echoes it, and opens the ALS scope. */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.headers[CORRELATION_ID_HEADER.toLowerCase()];
  const id =
    typeof incoming === 'string' && /^[\w-]{1,100}$/.test(incoming) ? incoming : randomUUID();
  (req as Request & { id: string }).id = id;
  res.setHeader(CORRELATION_ID_HEADER, id);
  RequestContext.run({ requestId: id }, next);
}
