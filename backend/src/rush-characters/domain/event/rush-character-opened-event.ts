import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';

export const RushCharactersOpenedEventType = 'RushCharactersOpenedEvent';

export type RushCharactersOpenedEventPayload = {};

export class RushCharactersOpenedEvent
  implements DomainEvent<RushCharactersOpenedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: RushCharactersOpenedEventPayload,
    public readonly type: string = RushCharactersOpenedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
