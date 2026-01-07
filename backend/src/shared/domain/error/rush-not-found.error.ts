import {DomainError} from './domain.error';

export class RushNotFoundError extends DomainError {
  constructor(rushId: string) {
    super(`Rush ${rushId} not found`);
    this.name = 'RushNotFoundError';
  }
}
