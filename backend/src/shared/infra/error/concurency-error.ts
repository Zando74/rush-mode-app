import {InfrastructureError} from './infrastructure-error';

export class ConcurrencyError extends InfrastructureError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = 'ConcurencyError';
  }
}
