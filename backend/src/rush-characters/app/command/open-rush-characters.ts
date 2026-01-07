import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushCharactersAggregate,
  RushCharactersSnapshotState,
  RushCharactersAggregateType,
} from '../../domain/entity/rush-characters.aggregate';
import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';

export interface OpenRushCharactersCommand {
  rushId: string;
}

export class OpenRushCharacters {
  constructor(private eventStore: EventStore) {}

  @Traceable()
  async handle(command: OpenRushCharactersCommand) {
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

    const rushCharacters = BaseEsRootAggregate.rehydrate(
      RushCharactersAggregate,
      rushCharactersEvents.events,
      rushCharactersEvents.snapshot,
    );

    const events = rushCharacters.OpenRushCharacters();
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushCharactersId(command.rushId),
      events,
      rushCharacters.toSnapshot(),
      RushCharactersAggregateType,
    );
  }
}
