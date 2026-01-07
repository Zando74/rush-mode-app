import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushFraudAggregate,
  RushFraudSnapshotState,
  RushFraudAggregateType,
} from '../../domain/entity/rush-fraud.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';

export interface CloseRushFraudCommand {
  rushId: string;
}

export class CloseRushFraud {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: CloseRushFraudCommand) {
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

    const events = rushFraud.closeRushFraud();
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushFraudId(command.rushId),
      events,
      rushFraud.toSnapshot(),
      RushFraudAggregateType,
    );
  }
}
