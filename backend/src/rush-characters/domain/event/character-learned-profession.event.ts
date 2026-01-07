import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {Profession} from '../entity/character.entity';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterLearnedProfessionEventType =
  'CharacterLearnedProfessionEvent';

export type CharacterLearnedProfessionEventPayload =
  BasePayloadCharacterEvent & {
    profession: Profession;
  };

export class CharacterLearnedProfessionEvent
  implements DomainEvent<CharacterLearnedProfessionEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterLearnedProfessionEventPayload,
    public readonly type: string = CharacterLearnedProfessionEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
