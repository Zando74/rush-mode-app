import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushProgressionAggregate,
  RushProgressionAggregateType,
} from '../../domain/entity/rush-progression.aggregate';
import {RushAlreadyExistError} from '../../../shared/domain/error/rush-already-exist.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface CreateRushProgressionCommand {
  rushId: string;
  name: string;
}

export class CreateRushProgression {
  constructor(
    private eventStore: EventStore,
    private rushToIdRepository: RushNameToIdRepository,
  ) {}

  @Traceable()
  async handle(command: CreateRushProgressionCommand) {
    const existingRushProgression =
      await this.eventStore.loadFromLatestSnapshot(
        new RushProgressionId(command.rushId),
      );

    if (
      existingRushProgression.events.length > 0 ||
      existingRushProgression.snapshot
    ) {
      throw new RushAlreadyExistError(command.rushId);
    }

    const {events, aggregate} = BaseEsRootAggregate.create(
      RushProgressionAggregate,
      command.rushId,
      command.name,
    );
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushProgressionId(command.rushId),
      events,
      aggregate.toSnapshot(),
      RushProgressionAggregateType,
    );
    if (!(await this.rushToIdRepository.isRegistered(command.name))) {
      await this.rushToIdRepository.registerRushNameToId(
        command.name,
        command.rushId,
      );
    }
  }
}
