import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';

export const RushProgressionCreatedEventType = 'RushProgressionCreatedEvent';

export type RushProgressionCreatedEventPayload = {
  name: string;
};

export class RushProgressionCreatedEvent
  implements DomainEvent<RushProgressionCreatedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushProgressionId,
    public readonly payload: RushProgressionCreatedEventPayload,
    public readonly type: string = RushProgressionCreatedEventType,
    public readonly boundedContext = BoundedContext.Progression,
  ) {}
}
