export const TYPES = {
  // shared
  WriteDatabaseService: Symbol('DatabaseService'),
  ReadDatabaseService: Symbol('ReadDatabaseService'),
  CacheService: Symbol('CacheService'),
  MessagingService: Symbol('MessagingService'),
  PgSnapshotRepository: Symbol('PgSnapshotRepository'),
  ProcessedEvent: Symbol('ProcessedEvent'),
  OutboxStore: Symbol('OutboxStore'),
  EventStore: Symbol('EventStore'),
  AuditLogRepository: Symbol('AuditLogRepository'),
  RushNameToIdRepository: Symbol('RushNameToIdRepository'),
  DomainEventBus: Symbol('DomainEventBus'),
  IntegrationEventBus: Symbol('IntegrationEventBus'),
  IntegrationEventDispatcherCron: Symbol('IntegrationEventDispatcherCron'),
  ProcessedEventDeletionCron: Symbol('ProcessedEventDeletionCron'),
  LoggingDomainEventHandler: Symbol('LoggingDomainEventHandler'),

  // RushCharacters
  RushCharactersReadModel: Symbol('RushCharactersReadModel'),
  RushCharactersProjectionHandler: Symbol('RushCharactersProjectionHandler'),

  // RushFraud
  RushFraudReadModel: Symbol('RushFraudReadModel'),
  RushFraudProjectionHandler: Symbol('RushFraudProjectionHandler'),

  // RushProgression
  RushProgressionReadModel: Symbol('RushProgressionReadModel'),
  RushProgressionProjectionHandler: Symbol('RushProgressionProjectionHandler'),
};
