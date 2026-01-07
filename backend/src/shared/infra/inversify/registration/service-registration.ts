import {Container} from 'inversify';
import {WriteDatabaseService} from '../../write-postgresql/init';
import {ReadDatabaseService} from '../../read-postgresql/init';
import {TYPES} from '../type';
import {PgOutboxRepository} from '../../write-postgresql/repository/pg-outbox-repository.impl';

import {IntegrationEventBus} from '../../../app/event/integration-event-bus';
import {DomainEventBusInMemory} from '../../event-bus/in-memory-domain-event-bus';
import {PgSnapshotRepository} from '../../write-postgresql/repository/pg-snapshot-repository.impl';
import {PgEventStoreRepository} from '../../write-postgresql/repository/pg-event-store-repository.impl';

import {RabbitMQService} from '../../rabbit-mq/init';
import {IntegrationEventDispatcherCron} from '../../../app/cron/integration-event-dispatcher.cron';

import {PgProcessedEventRepository} from '../../write-postgresql/repository/pg-processed-event-repository.impl';
import {OutboxStore} from '../../../domain/port/outbox-store.port';
import {EventStore} from '../../../domain/port/event-store.port';
import {DomainEventBus} from '../../../domain/port/domain-event-bus';
import {ProcessedEvent} from '../../../domain/port/processed-event.port';
import {RabbitMQIntegrationEventBus} from '../../event-bus/rabbitmq-integration-event-bus';
import {LoggingDomainEventHandler} from '../../handler/logging-domain-event-handler';
import {PgAuditStoreRepository} from '../../write-postgresql/repository/pg-audit-log-repository.impl';
import {ProcessedEventDeletionCron} from '../../../app/cron/processed-event-deletion.cron';
import {RushNameToIdRepository} from '../../../domain/port/rush-name-to-id-repository';
import {PgRushNameToIdRepository} from '../../write-postgresql/repository/pg-rush-name-to-id.impl';

export const RegisterDatabases = async (container: Container) => {
  const writeDbService = new WriteDatabaseService();
  const readDbService = new ReadDatabaseService();

  container
    .bind<WriteDatabaseService>(TYPES.WriteDatabaseService)
    .toConstantValue(writeDbService);
  container
    .bind<ReadDatabaseService>(TYPES.ReadDatabaseService)
    .toConstantValue(readDbService);

  await writeDbService.initialize();
  await readDbService.initialize();
};

export const RegisterOutbox = (container: Container) => {
  container
    .bind<OutboxStore>(TYPES.OutboxStore)
    .toConstantValue(
      new PgOutboxRepository(
        container.get<WriteDatabaseService>(TYPES.WriteDatabaseService),
      ),
    );
};

export const RegisterSnapshot = (container: Container) => {
  container
    .bind<PgSnapshotRepository>(TYPES.PgSnapshotRepository)
    .toConstantValue(
      new PgSnapshotRepository(
        container.get<WriteDatabaseService>(TYPES.WriteDatabaseService),
      ),
    );
};

export const RegisterEventStore = (container: Container) => {
  container
    .bind<EventStore>(TYPES.EventStore)
    .toConstantValue(
      new PgEventStoreRepository(
        container.get<WriteDatabaseService>(TYPES.WriteDatabaseService),
        container.get<DomainEventBus>(TYPES.DomainEventBus),
        container.get<PgSnapshotRepository>(TYPES.PgSnapshotRepository),
      ),
    );
};

export const RegisterAuditLog = (container: Container) => {
  container
    .bind<PgAuditStoreRepository>(TYPES.AuditLogRepository)
    .toConstantValue(
      new PgAuditStoreRepository(
        container.get<WriteDatabaseService>(TYPES.WriteDatabaseService),
      ),
    );
};

export const RegisterProcessedEventRepository = (container: Container) => {
  container
    .bind<ProcessedEvent>(TYPES.ProcessedEvent)
    .toConstantValue(
      new PgProcessedEventRepository(
        container.get<WriteDatabaseService>(TYPES.WriteDatabaseService),
      ),
    );
};

export const RegisterRushNameToIdRepository = (container: Container) => {
  container
    .bind<RushNameToIdRepository>(TYPES.RushNameToIdRepository)
    .toConstantValue(
      new PgRushNameToIdRepository(
        container.get<WriteDatabaseService>(TYPES.WriteDatabaseService),
      ),
    );
};

export const RegisterEventBuses = async (container: Container) => {
  container
    .bind<DomainEventBus>(TYPES.DomainEventBus)
    .toConstantValue(new DomainEventBusInMemory());

  container
    .bind<RabbitMQService>(TYPES.MessagingService)
    .toConstantValue(new RabbitMQService());
  await container.get<RabbitMQService>(TYPES.MessagingService).initialize();
  container
    .bind<IntegrationEventBus>(TYPES.IntegrationEventBus)
    .toConstantValue(
      new RabbitMQIntegrationEventBus(
        container.get<RabbitMQService>(TYPES.MessagingService).getChannel(),
        container.get<ProcessedEvent>(TYPES.ProcessedEvent),
      ),
    );
};

export const RegisterIntegrationEventDispatcherCron = (
  container: Container,
) => {
  container
    .bind<IntegrationEventDispatcherCron>(TYPES.IntegrationEventDispatcherCron)
    .toConstantValue(
      new IntegrationEventDispatcherCron(
        container.get<IntegrationEventBus>(TYPES.IntegrationEventBus),
        container.get<OutboxStore>(TYPES.OutboxStore),
      ),
    );
};

export const RegisterProcessedEventDeletionCron = (container: Container) => {
  container
    .bind<ProcessedEventDeletionCron>(TYPES.ProcessedEventDeletionCron)
    .toConstantValue(
      new ProcessedEventDeletionCron(
        container.get<ProcessedEvent>(TYPES.ProcessedEvent),
      ),
    );
};

export const RegisterDomainEventLoggerHandler = (container: Container) => {
  container
    .bind<LoggingDomainEventHandler>(TYPES.LoggingDomainEventHandler)
    .toConstantValue(
      new LoggingDomainEventHandler(
        container.get<DomainEventBus>(TYPES.DomainEventBus),
      ),
    );
};
