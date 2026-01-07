import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushProgressionAggregate,
  RushProgressionSnapshotState,
  RushProgressionAggregateType,
} from '../../domain/entity/rush-progression.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';

export interface OpenRushProgressionCommand {
  rushId: string;
}

export class OpenRushProgression {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: OpenRushProgressionCommand) {
    const rushProgressionEvents =
      await this.eventStore.loadFromLatestSnapshot<RushProgressionSnapshotState>(
        new RushProgressionId(command.rushId),
      );

    if (
      rushProgressionEvents.events.length === 0 &&
      !rushProgressionEvents.snapshot
    ) {
      throw new RushNotFoundError(command.rushId);
    }

    const rushProgression = BaseEsRootAggregate.rehydrate(
      RushProgressionAggregate,
      rushProgressionEvents.events,
      rushProgressionEvents.snapshot,
    );

    const events = rushProgression.openRushProgression();
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushProgressionId(command.rushId),
      events,
      rushProgression.toSnapshot(),
      RushProgressionAggregateType,
    );
  }
}
