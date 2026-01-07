import {Repository} from 'typeorm';
import {RushProgressionProjection} from '../projection/rush-progression.projection';
import {BaseIntegrationHandler} from '../../../../shared/infra/event-bus/handler/base-integration-handler';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {IntegrationEventBus} from '../../../../shared/app/event/integration-event-bus';
import {EventStore} from '../../../../shared/domain/port/event-store.port';
import {
  RushProgressionAggregate,
  RushProgressionSnapshotState,
  RushProgressionAggregateType,
} from '../../../domain/entity/rush-progression.aggregate';
import {AggregateUpdatedIntegrationEvent} from '../../../../shared/app/event/aggregate-updated-integration-event';
import {Traceable} from '../../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {BaseEsRootAggregate} from '../../../../shared/domain/entity/base-es-root-aggregate';
import {Logger} from '../../../../shared/infra/logger/logger';
import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';

export class RushProgressionProjectionHandlerImpl extends BaseIntegrationHandler {
  private rushProgressionRepo: Repository<RushProgressionProjection>;

  constructor(
    databaseService: ReadDatabaseService,
    eventBus: IntegrationEventBus,
    private readonly eventStore: EventStore,
  ) {
    super();
    this.rushProgressionRepo = databaseService.getRepository(
      RushProgressionProjection,
    );

    this.on(
      RushProgressionAggregateType,
      async event =>
        await this.onRushProgressionUpdate(
          event as AggregateUpdatedIntegrationEvent,
        ),
    );
    this.subscribe(eventBus);
  }

  @Traceable()
  private async onRushProgressionUpdate(
    event: AggregateUpdatedIntegrationEvent,
  ) {
    const rushProgressionId = event.payload.aggregateId;
    const rushProgressionEvents =
      await this.eventStore.loadFromLatestSnapshot<RushProgressionSnapshotState>(
        rushProgressionId,
      );
    if (
      rushProgressionEvents.events.length === 0 &&
      !rushProgressionEvents.snapshot
    ) {
      return;
    }

    const projection = BaseEsRootAggregate.rehydrate(
      RushProgressionAggregate,
      rushProgressionEvents.events,
      rushProgressionEvents.snapshot,
    );
    const snapshot = projection.toSnapshot();

    await this.rushProgressionRepo.save({
      id: AggregateId.getIdentityHash(snapshot.id),
      name: snapshot.state.rushName,
      progressions: snapshot.state.progressions,
      open: snapshot.state.open,
    });

    Logger.info(
      `Rush : ${snapshot.state.rushName} Progression projection updated`,
    );
  }
}
