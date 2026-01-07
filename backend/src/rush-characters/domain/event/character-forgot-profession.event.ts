import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {BasePayloadCharacterEvent} from './base-event';

export const CharacterForgotProfessionEventType =
  'CharacterForgotProfessionEvent';

export type CharacterForgotProfessionEventPayload =
  BasePayloadCharacterEvent & {
    professionId: number;
  };

export class CharacterForgotProfessionEvent
  implements DomainEvent<CharacterForgotProfessionEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushCharactersId,
    public readonly payload: CharacterForgotProfessionEventPayload,
    public readonly type: string = CharacterForgotProfessionEventType,
    public readonly boundedContext = BoundedContext.Player,
  ) {}
}
