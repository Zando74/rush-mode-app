import {DomainError} from './domain.error';

export class RushAlreadyClosedError extends DomainError {
  constructor(rushId: string) {
    super(`Rush ${rushId} is already closed`);
    this.name = 'RushAlreadyClosedError';
  }
}
