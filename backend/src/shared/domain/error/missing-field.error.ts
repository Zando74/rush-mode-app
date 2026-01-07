import {DomainError} from './domain.error';

export class MissingFieldError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'MissingFieldError';
  }
}
