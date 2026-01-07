import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {TradeEntityProps} from '../entity/trade.entity';

export const RushFraudTradeRegisteredEventType =
  'RushFraudTradeRegisteredEvent';

export type RushFraudTradeRegisteredEventPayload = {
  trade: TradeEntityProps;
};

export class RushFraudTradeRegisteredEvent
  implements DomainEvent<RushFraudTradeRegisteredEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushFraudId,
    public readonly payload: RushFraudTradeRegisteredEventPayload,
    public readonly type: string = RushFraudTradeRegisteredEventType,
    public readonly boundedContext = BoundedContext.Fraud,
  ) {}
}
