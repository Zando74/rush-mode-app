import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {CharacterEntityProps} from '../entity/character.entity';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterJoinedTheRushEventType = 'CharacterJoinedTheRushEvent';

export type CharacterJoinedTheRushEventPayload = BasePayloadCharacterEvent & {
  character: CharacterEntityProps;
};

export class CharacterJoinedTheRushEvent
  implements DomainEvent<CharacterJoinedTheRushEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterJoinedTheRushEventPayload,
    public readonly type: string = CharacterJoinedTheRushEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
