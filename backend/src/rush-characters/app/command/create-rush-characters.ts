import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushCharactersAggregate,
  RushCharactersAggregateType,
} from '../../domain/entity/rush-characters.aggregate';
import {RushAlreadyExistError} from '../../../shared/domain/error/rush-already-exist.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface CreateRushCharactersCommand {
  rushId: string;
  name: string;
}

export class CreateRushCharacters {
  constructor(
    private eventStore: EventStore,
    private rushToIdRepository: RushNameToIdRepository,
  ) {}

  @Traceable()
  async handle(command: CreateRushCharactersCommand) {
    const existingRushCharacters = await this.eventStore.loadFromLatestSnapshot(
      new RushCharactersId(command.rushId),
    );

    if (
      existingRushCharacters.events.length > 0 ||
      existingRushCharacters.snapshot
    ) {
      throw new RushAlreadyExistError(command.rushId);
    }

    const {events, aggregate} = BaseEsRootAggregate.create(
      RushCharactersAggregate,
      command.rushId,
      command.name,
    );
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushCharactersId(command.rushId),
      events,
      aggregate.toSnapshot(),
      RushCharactersAggregateType,
    );
    if (!(await this.rushToIdRepository.isRegistered(command.name))) {
      await this.rushToIdRepository.registerRushNameToId(
        command.name,
        command.rushId,
      );
    }
  }
}
