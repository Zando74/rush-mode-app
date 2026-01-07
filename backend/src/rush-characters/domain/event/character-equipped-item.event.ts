import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterEquippedItemEventType = 'CharacterEquippedItemEvent';

export type CharacterEquippedItemEventPayload = BasePayloadCharacterEvent & {
  itemId: number;
};

export class CharacterEquippedItemEvent
  implements DomainEvent<CharacterEquippedItemEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterEquippedItemEventPayload,
    public readonly type: string = CharacterEquippedItemEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
