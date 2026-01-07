import {Repository} from 'typeorm';
import {RushCharactersProjection} from '../projection/rush-characters.projection';
import {BaseIntegrationHandler} from '../../../../shared/infra/event-bus/handler/base-integration-handler';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {IntegrationEventBus} from '../../../../shared/app/event/integration-event-bus';
import {EventStore} from '../../../../shared/domain/port/event-store.port';
import {
  RushCharactersAggregate,
  RushCharactersSnapshotState,
  RushCharactersAggregateType,
} from '../../../domain/entity/rush-characters.aggregate';
import {AggregateUpdatedIntegrationEvent} from '../../../../shared/app/event/aggregate-updated-integration-event';
import {Traceable} from '../../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {BaseEsRootAggregate} from '../../../../shared/domain/entity/base-es-root-aggregate';
import {Logger} from '../../../../shared/infra/logger/logger';
import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';

export class RushCharactersProjectionHandlerImpl extends BaseIntegrationHandler {
  private rushCharactersRepo: Repository<RushCharactersProjection>;

  constructor(
    databaseService: ReadDatabaseService,
    eventBus: IntegrationEventBus,
    private readonly eventStore: EventStore,
  ) {
    super();
    this.rushCharactersRepo = databaseService.getRepository(
      RushCharactersProjection,
    );

    this.on(
      RushCharactersAggregateType,
      async event =>
        await this.onRushCharactersUpdate(
          event as AggregateUpdatedIntegrationEvent,
        ),
    );
    this.subscribe(eventBus);
  }

  @Traceable()
  private async onRushCharactersUpdate(
    event: AggregateUpdatedIntegrationEvent,
  ) {
    const rushCharactersId = event.payload.aggregateId;
    const rushCharactersEvents =
      await this.eventStore.loadFromLatestSnapshot<RushCharactersSnapshotState>(
        rushCharactersId,
      );
    if (
      rushCharactersEvents.events.length === 0 &&
      !rushCharactersEvents.snapshot
    ) {
      return;
    }
    const projection = BaseEsRootAggregate.rehydrate(
      RushCharactersAggregate,
      rushCharactersEvents.events,
      rushCharactersEvents.snapshot,
    );
    const snapshot = projection.toSnapshot();
    await this.rushCharactersRepo.save({
      id: AggregateId.getIdentityHash(snapshot.id),
      name: snapshot.state.rushName,
      characters: snapshot.state.characters,
      open: snapshot.state.open,
    });

    Logger.info(
      `Rush : ${snapshot.state.rushName} characters projection updated`,
    );
  }
}
