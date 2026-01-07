import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterProfessionLeveledUpEventType =
  'CharacterProfessionLeveledUpEvent';

export type CharacterProfessionLeveledUpEventPayload =
  BasePayloadCharacterEvent & {
    professionId: number;
    newLevel: number;
  };

export class CharacterProfessionLeveledUpEvent
  implements DomainEvent<CharacterProfessionLeveledUpEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterProfessionLeveledUpEventPayload,
    public readonly type: string = CharacterProfessionLeveledUpEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
