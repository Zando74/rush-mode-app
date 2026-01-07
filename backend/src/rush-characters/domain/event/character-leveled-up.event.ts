import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterLeveledUpEventType = 'CharacterLeveledUpEvent';

export type CharacterLeveledUpEventPayload = BasePayloadCharacterEvent & {
  newLevel: number;
};

export class CharacterLeveledUpEvent
  implements DomainEvent<CharacterLeveledUpEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterLeveledUpEventPayload,
    public readonly type: string = CharacterLeveledUpEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
