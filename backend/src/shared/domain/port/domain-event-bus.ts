import {DomainEvent} from '../event/domain-event';

export interface DomainEventHandler {
  handle(event: DomainEvent): Promise<void>;
}

export interface DomainEventBus {
  publish(events: DomainEvent[]): Promise<void>;
  subscribeCritical(eventName: string, handler: DomainEventHandler): void;
  subscribeNonCritical(eventName: string, handler: DomainEventHandler): void;
}
