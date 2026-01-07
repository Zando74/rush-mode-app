import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushFraudAggregate,
  RushFraudAggregateType,
  RushFraudSnapshotState,
} from '../../domain/entity/rush-fraud.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {TradeEntity, TradeEntityProps} from '../../domain/entity/trade.entity';

export interface RegisterRushFraudTradeCommand {
  rushId: string;
  trade: TradeEntityProps[];
}

export class RegisterRushFraudTrade {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: RegisterRushFraudTradeCommand) {
    const rushFraudEvents =
      await this.eventStore.loadFromLatestSnapshot<RushFraudSnapshotState>(
        new RushFraudId(command.rushId),
      );

    if (rushFraudEvents.events.length === 0 && !rushFraudEvents.snapshot) {
      throw new RushNotFoundError(command.rushId);
    }

    const rushFraud = BaseEsRootAggregate.rehydrate(
      RushFraudAggregate,
      rushFraudEvents.events,
      rushFraudEvents.snapshot,
    );

    const events = rushFraud.registerTradeFraud(
      command.trade.map(t => new TradeEntity(t)),
    );
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushFraudId(command.rushId),
      events,
      rushFraud.toSnapshot(),
      RushFraudAggregateType,
    );
  }
}
