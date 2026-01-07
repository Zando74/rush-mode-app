import {DomainError} from './domain.error';

export class RushAlreadyOpenError extends DomainError {
  constructor(rushId: string) {
    super(`Rush ${rushId} is already open`);
    this.name = 'RushAlreadyOpenError';
  }
}
