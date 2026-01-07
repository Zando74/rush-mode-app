import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushCharactersSnapshotState} from '../../domain/entity/rush-characters.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface CleanRushCharactersCommand {
  rushId: string;
}

export class CleanRushCharacters {
  constructor(
    private eventStore: EventStore,
    private rushToIdRepository: RushNameToIdRepository,
  ) {}

  @Traceable()
  async handle(command: CleanRushCharactersCommand) {
    const rushCharactersEvents =
      await this.eventStore.loadFromLatestSnapshot<RushCharactersSnapshotState>(
        new RushCharactersId(command.rushId),
      );

    if (
      rushCharactersEvents.events.length === 0 &&
      !rushCharactersEvents.snapshot
    ) {
      throw new RushNotFoundError(command.rushId);
    }

    await this.eventStore.delete(new RushCharactersId(command.rushId));
    await this.rushToIdRepository.delete(command.rushId);
  }
}
