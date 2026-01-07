import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';

export const RushCharactersClosedEventType = 'RushCharactersClosedEvent';

export type RushCharactersClosedEventPayload = {};

export class RushCharactersClosedEvent
  implements DomainEvent<RushCharactersClosedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: RushCharactersClosedEventPayload,
    public readonly type: string = RushCharactersClosedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
