import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';

export const RushFraudOpenedEventType = 'RushFraudOpenedEvent';

export type RushFraudOpenedEventPayload = {};

export class RushFraudOpenedEvent
  implements DomainEvent<RushFraudOpenedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushFraudId,
    public readonly payload: RushFraudOpenedEventPayload,
    public readonly type: string = RushFraudOpenedEventType,
    public readonly boundedContext = BoundedContext.Fraud,
  ) {}
}
