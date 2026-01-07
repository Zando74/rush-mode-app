import {IntegrationEvent} from '../../app/event/integration-event';

export interface OutboxStore {
  getPendingEvents(): Promise<IntegrationEvent[]>;
  getAcknowledgedEvents(types: string[]): Promise<IntegrationEvent[]>;
  save(event: IntegrationEvent): Promise<void>;
  acknowledge(event: IntegrationEvent[]): Promise<void>;
}
