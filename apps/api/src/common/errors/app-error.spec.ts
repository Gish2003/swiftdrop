import { HttpStatus } from '@nestjs/common';
import { AppError, notImplemented } from './app-error';

describe('AppError', () => {
  it('carries code, status and details', () => {
    const e = new AppError('INVALID_STATUS_TRANSITION', 'nope', HttpStatus.CONFLICT, {
      from: 'CREATED',
    });
    expect(e.code).toBe('INVALID_STATUS_TRANSITION');
    expect(e.getStatus()).toBe(409);
    expect(e.details).toEqual({ from: 'CREATED' });
  });

  it('notImplemented throws 501', () => {
    expect(() => notImplemented('M4')).toThrow(
      expect.objectContaining({ code: 'NOT_IMPLEMENTED' }),
    );
  });
});
