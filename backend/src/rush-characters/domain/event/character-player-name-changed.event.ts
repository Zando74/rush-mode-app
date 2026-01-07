import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterPlayerNameChangedEventType =
  'CharacterPlayerNameChangedEvent';

export type CharacterPlayerNameChangedEventPayload =
  BasePayloadCharacterEvent & {
    newName: string;
  };

export class CharacterPlayerNameChangedEvent
  implements DomainEvent<CharacterPlayerNameChangedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterPlayerNameChangedEventPayload,
    public readonly type: string = CharacterPlayerNameChangedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
