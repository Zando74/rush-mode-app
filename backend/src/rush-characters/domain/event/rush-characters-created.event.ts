import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';

export const RushCharactersCreatedEventType = 'RushCharactersCreatedEvent';

export type RushCharactersCreatedEventPayload = {
  name: string;
};

export class RushCharactersCreatedEvent
  implements DomainEvent<RushCharactersCreatedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: RushCharactersCreatedEventPayload,
    public readonly type: string = RushCharactersCreatedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
