import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';

export const RushProgressionClosedEventType = 'RushProgressionClosedEvent';

export type RushProgressionClosedEventPayload = {};

export class RushProgressionClosedEvent
  implements DomainEvent<RushProgressionClosedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushProgressionId,
    public readonly payload: RushProgressionClosedEventPayload,
    public readonly type: string = RushProgressionClosedEventType,
    public readonly boundedContext = BoundedContext.Progression,
  ) {}
}
