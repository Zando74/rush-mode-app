import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';

export const RushProgressionRegisteredEventType =
  'RushProgressionRegisteredEvent';

export type RushProgressionRegisteredEventPayload = {
  playerName: string;
  achievement: string;
};

export class RushProgressionRegisteredEvent
  implements DomainEvent<RushProgressionRegisteredEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushProgressionId,
    public readonly payload: RushProgressionRegisteredEventPayload,
    public readonly type: string = RushProgressionRegisteredEventType,
    public readonly boundedContext = BoundedContext.Progression,
  ) {}
}
