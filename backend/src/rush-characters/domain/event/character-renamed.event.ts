import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterRenamedEventType = 'CharacterRenamedEvent';

export type CharacterRenamedPayloadEvent = BasePayloadCharacterEvent & {
  newName: string;
};

export class CharacterRenamedEvent
  implements DomainEvent<CharacterRenamedPayloadEvent>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterRenamedPayloadEvent,
    public readonly type: string = CharacterRenamedEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
