import {BaseError} from './base.error';

export abstract class DomainError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'DOMAIN_ERROR', details);
  }
}
