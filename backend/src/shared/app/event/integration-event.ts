import {EventPayload} from '../../domain/event/domain-event';

export interface IntegrationEvent<T extends EventPayload = EventPayload> {
  eventId: string;
  readonly occuredAt: Date;
  readonly type: string;
  correlationId: string;
  readonly payload: T;
}
