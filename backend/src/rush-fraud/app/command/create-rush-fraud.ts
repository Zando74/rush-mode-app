import {applyCorrelationIdToEvents} from '../../../shared/app/util/correlation-id-applier';
import {BaseEsRootAggregate} from '../../../shared/domain/entity/base-es-root-aggregate';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {Traceable} from '../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {
  RushFraudAggregate,
  RushFraudAggregateType,
} from '../../domain/entity/rush-fraud.aggregate';
import {RushAlreadyExistError} from '../../../shared/domain/error/rush-already-exist.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface CreateRushFraudCommand {
  rushId: string;
  name: string;
}

export class CreateRushFraud {
  constructor(
    private eventStore: EventStore,
    private rushToIdRepository: RushNameToIdRepository,
  ) {}

  @Traceable()
  async handle(command: CreateRushFraudCommand) {
    const existingRushFraud = await this.eventStore.loadFromLatestSnapshot(
      new RushFraudId(command.rushId),
    );

    if (existingRushFraud.events.length > 0 || existingRushFraud.snapshot) {
      throw new RushAlreadyExistError(command.rushId);
    }

    const {events, aggregate} = BaseEsRootAggregate.create(
      RushFraudAggregate,
      command.rushId,
      command.name,
    );
    applyCorrelationIdToEvents(crypto.randomUUID(), events);
    await this.eventStore.save(
      new RushFraudId(command.rushId),
      events,
      aggregate.toSnapshot(),
      RushFraudAggregateType,
    );
    if (!(await this.rushToIdRepository.isRegistered(command.name))) {
      await this.rushToIdRepository.registerRushNameToId(
        command.name,
        command.rushId,
      );
    }
  }
}
