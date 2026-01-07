import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';

export const RushFraudCreatedEventType = 'RushFraudCreatedEvent';

export type RushFraudCreatedEventPayload = {
  name: string;
};

export class RushFraudCreatedEvent
  implements DomainEvent<RushFraudCreatedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushFraudId,
    public readonly payload: RushFraudCreatedEventPayload,
    public readonly type: string = RushFraudCreatedEventType,
    public readonly boundedContext = BoundedContext.Fraud,
  ) {}
}
