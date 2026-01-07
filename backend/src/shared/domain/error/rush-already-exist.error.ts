import {DomainError} from './domain.error';

export class RushAlreadyExistError extends DomainError {
  constructor(rushId: string) {
    super(`Rush ${rushId} is already registered`);
    this.name = 'RushAlreadyExistError';
  }
}
