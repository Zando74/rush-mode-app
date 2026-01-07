import {DomainError} from './domain.error';

export class UnhandledDomainEventError extends DomainError {
  constructor(eventType: string) {
    super(`Unhandler for domain event type ${eventType}`);
    this.name = 'UnhandledDomainEventError';
  }
}
