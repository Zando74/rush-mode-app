import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterPositionChangedEventType =
  'CharacterPositionChangedEvent';

export type CharacterPositionChangedPayloadEvent = BasePayloadCharacterEvent & {
  newX: number;
  newY: number;
};

export class CharacterPositionChangedEvent
  implements DomainEvent<CharacterPositionChangedPayloadEvent>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterPositionChangedPayloadEvent,
    public readonly type: string = CharacterPositionChangedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
