import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {ProgressionEntityProps} from '../../domain/entity/progression.entity';
import {
  RushProgressionAggregate,
  RushProgressionAggregateType,
  RushProgressionSnapshotState,
} from '../../domain/entity/rush-progression.aggregate';

export interface RegisterRushProgressionCommand {
  rushId: string;
  progressions: ProgressionEntityProps[];
}

export class RegisterRushProgression {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: RegisterRushProgressionCommand) {
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

    const events = rushProgression.registerProgression(command.progressions);

    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushProgressionId(command.rushId),
      events,
      rushProgression.toSnapshot(),
      RushProgressionAggregateType,
    );
  }
}
