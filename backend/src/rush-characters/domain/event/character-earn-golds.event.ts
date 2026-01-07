import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterEarnGoldsEventType = 'CharacterEarnGoldsEvent';

export type CharacterEarnGoldsEventPayload = BasePayloadCharacterEvent & {
  amount: number;
};

export class CharacterEarnGoldsEvent
  implements DomainEvent<CharacterEarnGoldsEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterEarnGoldsEventPayload,
    public readonly type: string = CharacterEarnGoldsEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
