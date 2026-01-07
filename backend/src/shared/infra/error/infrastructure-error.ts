import {BaseError} from '../../domain/error/base.error';

export abstract class InfrastructureError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'INFRASTRUCTURE_ERROR', details);
  }
}
