import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterDeadEventType = 'CharacterDeadEvent';

export type CharacterDeadEventPayload = BasePayloadCharacterEvent;

export class CharacterDeadEvent
  implements DomainEvent<CharacterDeadEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterDeadEventPayload,
    public readonly type: string = CharacterDeadEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
