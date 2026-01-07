import {Repository} from 'typeorm';
import {RushFraudProjection} from '../projection/rush-fraud.projection';
import {BaseIntegrationHandler} from '../../../../shared/infra/event-bus/handler/base-integration-handler';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {IntegrationEventBus} from '../../../../shared/app/event/integration-event-bus';
import {EventStore} from '../../../../shared/domain/port/event-store.port';
import {
  RushFraudAggregate,
  RushFraudSnapshotState,
  RushFraudAggregateType,
} from '../../../domain/entity/rush-fraud.aggregate';
import {AggregateUpdatedIntegrationEvent} from '../../../../shared/app/event/aggregate-updated-integration-event';
import {Traceable} from '../../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {BaseEsRootAggregate} from '../../../../shared/domain/entity/base-es-root-aggregate';
import {Logger} from '../../../../shared/infra/logger/logger';
import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';

export class RushFraudProjectionHandlerImpl extends BaseIntegrationHandler {
  private rushFraudRepo: Repository<RushFraudProjection>;

  constructor(
    databaseService: ReadDatabaseService,
    eventBus: IntegrationEventBus,
    private readonly eventStore: EventStore,
  ) {
    super();
    this.rushFraudRepo = databaseService.getRepository(RushFraudProjection);

    this.on(
      RushFraudAggregateType,
      async event =>
        await this.onRushFraudUpdate(event as AggregateUpdatedIntegrationEvent),
    );
    this.subscribe(eventBus);
  }

  @Traceable()
  private async onRushFraudUpdate(event: AggregateUpdatedIntegrationEvent) {
    const rushFraudId = event.payload.aggregateId;
    const rushFraudEvents =
      await this.eventStore.loadFromLatestSnapshot<RushFraudSnapshotState>(
        rushFraudId,
      );
    if (rushFraudEvents.events.length === 0 && !rushFraudEvents.snapshot) {
      return;
    }
    const projection = BaseEsRootAggregate.rehydrate(
      RushFraudAggregate,
      rushFraudEvents.events,
      rushFraudEvents.snapshot,
    );
    const snapshot = projection.toSnapshot();

    await this.rushFraudRepo.save({
      id: AggregateId.getIdentityHash(snapshot.id),
      name: snapshot.state.rushName,
      mails: snapshot.state.mails,
      trades: snapshot.state.trades,
      open: snapshot.state.open,
    });

    Logger.info(`Rush : ${snapshot.state.rushName} Fraud projection updated`);
  }
}
