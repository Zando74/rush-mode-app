import {AggregateId} from '../../domain/value-object/aggregate-id';
import {IntegrationEvent} from './integration-event';

export type AggregateUpdatedIntegrationEventPayload = {
  aggregateId: AggregateId;
};

export class AggregateUpdatedIntegrationEvent
  implements IntegrationEvent<AggregateUpdatedIntegrationEventPayload>
{
  occuredAt = new Date();
  constructor(
    readonly eventId: string,
    readonly payload: AggregateUpdatedIntegrationEventPayload,
    readonly correlationId: string,
    readonly type: string,
  ) {}
}
