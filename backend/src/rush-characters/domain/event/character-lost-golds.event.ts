import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterLostGoldsEventType = 'CharacterLostGoldsEvent';

export type CharacterLostGoldsEventPayload = BasePayloadCharacterEvent & {
  amount: number;
};

export class CharacterLostGoldsEvent
  implements DomainEvent<CharacterLostGoldsEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterLostGoldsEventPayload,
    public readonly type: string = CharacterLostGoldsEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
