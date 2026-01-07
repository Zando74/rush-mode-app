import {Container} from 'inversify';
import {
  RegisterAuditLog,
  RegisterDatabases,
  RegisterDomainEventLoggerHandler,
  RegisterEventBuses,
  RegisterEventStore,
  RegisterIntegrationEventDispatcherCron,
  RegisterOutbox,
  RegisterProcessedEventDeletionCron,
  RegisterProcessedEventRepository,
  RegisterRushNameToIdRepository,
  RegisterSnapshot,
} from './registration/service-registration';

const initializeSharedResources = async (): Promise<Container> => {
  const container = new Container();
  await RegisterDatabases(container);
  RegisterOutbox(container);
  RegisterSnapshot(container);
  RegisterProcessedEventRepository(container);
  RegisterRushNameToIdRepository(container);
  await RegisterEventBuses(container);
  RegisterEventStore(container);
  RegisterAuditLog(container);
  RegisterIntegrationEventDispatcherCron(container);
  RegisterProcessedEventDeletionCron(container);
  RegisterDomainEventLoggerHandler(container);

  return container;
};

class ContainerManager {
  static container: Container;

  public static async initializeSharedResources(): Promise<void> {
    ContainerManager.container = await initializeSharedResources();
  }

  public static get<T>(serviceID: symbol): T {
    if (!ContainerManager.container) {
      throw new Error('DI Container not initialized');
    }
    return ContainerManager.container.get<T>(serviceID);
  }

  public static async register<T>(serviceID: symbol, service: T): Promise<T> {
    if (!ContainerManager.container) {
      throw new Error('DI Container not initialized');
    }
    ContainerManager.container.bind<T>(serviceID).toConstantValue(service);
    return service;
  }
}

export default ContainerManager;
