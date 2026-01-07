import {IntegrationEvent} from './integration-event';

export interface IntegrationEventHandler {
  handle(event: IntegrationEvent): Promise<void>;
}

export interface IntegrationEventBus {
  publish(events: IntegrationEvent[]): Promise<void>;
  subscribe(eventName: string, handler: IntegrationEventHandler): void;
}
