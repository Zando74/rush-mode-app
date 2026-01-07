import {BaseError} from '../../domain/error/base.error';

export abstract class ApplicationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, 'APPLICATION_ERROR', details);
  }
}
