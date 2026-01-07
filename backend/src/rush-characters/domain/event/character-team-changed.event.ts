import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterTeamChangedEventType = 'CharacterTeamChangedEvent';

export type CharacterTeamChangedPayloadEvent = BasePayloadCharacterEvent & {
  newTeam: string;
};

export class CharacterTeamChangedEvent
  implements DomainEvent<CharacterTeamChangedPayloadEvent>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterTeamChangedPayloadEvent,
    public readonly type: string = CharacterTeamChangedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
