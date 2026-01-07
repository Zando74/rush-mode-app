import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushFraudSnapshotState} from '../../domain/entity/rush-fraud.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface CleanRushFraudCommand {
  rushId: string;
}

export class CleanRushFraud {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: CleanRushFraudCommand) {
    const rushFraudEvents =
      await this.eventStore.loadFromLatestSnapshot<RushFraudSnapshotState>(
        new RushFraudId(command.rushId),
      );

    if (rushFraudEvents.events.length === 0 && !rushFraudEvents.snapshot) {
      throw new RushNotFoundError(command.rushId);
    }

    await this.eventStore.delete(new RushFraudId(command.rushId));
  }
}
