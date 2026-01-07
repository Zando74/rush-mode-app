import {ProgressionEntityProps} from '../../../rush-progression/domain/entity/progression.entity';
import {RushProgressionAggregateType} from '../../../rush-progression/domain/entity/rush-progression.aggregate';
import {RushProgressionReadModel} from '../../../rush-progression/domain/read-model/port/rush-progression-read-model.port';
import {RushProgressionAppRouter} from '../../../rush-progression/infra/trpc/app';
import {IntegrationEventDispatcherCron} from '../../../shared/app/cron/integration-event-dispatcher.cron';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {createCallerFactory} from '../../../shared/infra/trpc/trpc';
import {waitForProjectionToBeUpToDate} from '../../shared/utils/wait-for-projection';

export class RushProgressionWorld {
  rushProgressionReadModel: RushProgressionReadModel;
  eventStore: EventStore;

  constructor() {}

  public reloadInfraRepositories() {
    this.eventStore = ContainerManager.get<EventStore>(TYPES.EventStore);

    this.rushProgressionReadModel =
      ContainerManager.get<RushProgressionReadModel>(
        TYPES.RushProgressionReadModel,
      );
  }

  public async HandleIntegrationEventDispatcher() {
    await ContainerManager.get<IntegrationEventDispatcherCron>(
      TYPES.IntegrationEventDispatcherCron,
    ).handle();
  }

  async registerRushProgression(rushId: string, name: string) {
    const createCaller = createCallerFactory(RushProgressionAppRouter);
    const caller = createCaller({});
    await caller.registerRushProgression({rushId, name});
  }

  async registerRushProgressionEvents(
    rushId: string,
    progressions: ProgressionEntityProps[],
  ) {
    const createCaller = createCallerFactory(RushProgressionAppRouter);
    const caller = createCaller({});
    await caller.registerRushProgressionEvents({rushId, progressions});
  }

  async closeRushProgression(rushId: string) {
    const createCaller = createCallerFactory(RushProgressionAppRouter);
    const caller = createCaller({});
    await caller.closeRush({rushId});
  }

  async cleanUpRushProgression(rushId: string) {
    const createCaller = createCallerFactory(RushProgressionAppRouter);
    const caller = createCaller({});
    await caller.cleanUpRush({rushId});
  }

  async getRushProgression(rushName: string) {
    await this.HandleIntegrationEventDispatcher();
    await waitForProjectionToBeUpToDate([RushProgressionAggregateType]);
    const createCaller = createCallerFactory(RushProgressionAppRouter);
    const caller = createCaller({});
    return await caller.getRushProgression({rushName});
  }
}
