import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterStatusUpdatedEventType = 'CharacterStatusUpdatedEvent';

export type CharacterStatusUpdatedEventPayload = BasePayloadCharacterEvent & {
  lastUpdate: number;
};

export class CharacterStatusUpdatedEvent
  implements DomainEvent<CharacterStatusUpdatedEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterStatusUpdatedEventPayload,
    public readonly type: string = CharacterStatusUpdatedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
