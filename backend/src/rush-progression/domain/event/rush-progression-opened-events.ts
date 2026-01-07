import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';

export const RushProgressionOpenedEventType = 'RushProgressionOpenedEvent';

export type RushProgressionOpenedEventPayload = {};

export class RushProgressionOpenedEvent
  implements DomainEvent<RushProgressionOpenedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushProgressionId,
    public readonly payload: RushProgressionOpenedEventPayload,
    public readonly type: string = RushProgressionOpenedEventType,
    public readonly boundedContext = BoundedContext.Progression,
  ) {}
}
