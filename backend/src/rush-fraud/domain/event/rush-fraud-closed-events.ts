import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';

export const RushFraudClosedEventType = 'RushFraudClosedEvent';

export type RushFraudClosedEventPayload = {};

export class RushFraudClosedEvent
  implements DomainEvent<RushFraudClosedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushFraudId,
    public readonly payload: RushFraudClosedEventPayload,
    public readonly type: string = RushFraudClosedEventType,
    public readonly boundedContext = BoundedContext.Fraud,
  ) {}
}
