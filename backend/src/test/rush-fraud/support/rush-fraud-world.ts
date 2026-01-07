import {MailEntityProps} from '../../../rush-fraud/domain/entity/mail.entity';
import {RushFraudAggregateType} from '../../../rush-fraud/domain/entity/rush-fraud.aggregate';
import {TradeEntityProps} from '../../../rush-fraud/domain/entity/trade.entity';
import {RushFraudReadModel} from '../../../rush-fraud/domain/read-model/port/rush-fraud-read-model.port';
import {RushFraudAppRouter} from '../../../rush-fraud/infra/trpc/app';
import {IntegrationEventDispatcherCron} from '../../../shared/app/cron/integration-event-dispatcher.cron';
import {EventStore} from '../../../shared/domain/port/event-store.port';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {createCallerFactory} from '../../../shared/infra/trpc/trpc';
import {waitForProjectionToBeUpToDate} from '../../shared/utils/wait-for-projection';

export class RushFraudWorld {
  rushFraudReadModel: RushFraudReadModel;
  eventStore: EventStore;

  constructor() {}

  public reloadInfraRepositories() {
    this.eventStore = ContainerManager.get<EventStore>(TYPES.EventStore);

    this.rushFraudReadModel = ContainerManager.get<RushFraudReadModel>(
      TYPES.RushFraudReadModel,
    );
  }

  public async HandleIntegrationEventDispatcher() {
    await ContainerManager.get<IntegrationEventDispatcherCron>(
      TYPES.IntegrationEventDispatcherCron,
    ).handle();
  }

  async registerRushFraud(rushId: string, name: string) {
    const createCaller = createCallerFactory(RushFraudAppRouter);
    const caller = createCaller({});
    await caller.registerRushFraud({rushId, name});
  }

  async registerFraudMail(rushId: string, mails: MailEntityProps[]) {
    const createCaller = createCallerFactory(RushFraudAppRouter);
    const caller = createCaller({});
    await caller.registerRushFraudEmail({rushId, mails});
  }

  async registerFraudTrade(rushId: string, trades: TradeEntityProps[]) {
    const createCaller = createCallerFactory(RushFraudAppRouter);
    const caller = createCaller({});
    await caller.registerRushFraudTrade({rushId, trades});
  }

  async closeRushFraud(rushId: string) {
    const createCaller = createCallerFactory(RushFraudAppRouter);
    const caller = createCaller({});
    await caller.closeRush({rushId});
  }

  async cleanUpRushFraud(rushId: string) {
    const createCaller = createCallerFactory(RushFraudAppRouter);
    const caller = createCaller({});
    await caller.cleanUpRush({rushId});
  }

  async getRushFraud(rushName: string) {
    await this.HandleIntegrationEventDispatcher();
    await waitForProjectionToBeUpToDate([RushFraudAggregateType]);
    const createCaller = createCallerFactory(RushFraudAppRouter);
    const caller = createCaller({});
    return await caller.getRushFraud({rushName});
  }
}
