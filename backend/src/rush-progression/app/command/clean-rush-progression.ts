import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushProgressionSnapshotState} from '../../domain/entity/rush-progression.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface CleanRushProgressionCommand {
  rushId: string;
}

export class CleanRushProgression {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: CleanRushProgressionCommand) {
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

    await this.eventStore.delete(new RushProgressionId(command.rushId));
  }
}
