import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterRemovedItemEventType = 'CharacterRemovedItemEvent';

export type CharacterRemovedItemEventPayload = BasePayloadCharacterEvent & {
  itemId: number;
};

export class CharacterRemovedItemEvent
  implements DomainEvent<CharacterRemovedItemEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterRemovedItemEventPayload,
    public readonly type: string = CharacterRemovedItemEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
