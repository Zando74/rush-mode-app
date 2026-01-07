import {DataSource, ObjectLiteral, ObjectType, Repository} from 'typeorm';

import {EventStoreModel} from './model/event-store.model';
import {SnapshotModel} from './model/snapshot.model';
import {Logger} from '../logger/logger';
import {OutboxModel} from './model/outbox.model';
import {ProcessedEventModel} from './model/processed-event.model';
import {AuditLogModel} from './model/audit-log.model';
import {RushNameToIdModel} from './model/rush-name-to-id.model';

export class WriteDatabaseService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.WRITE_DB_HOST,
      port: parseInt(process.env.WRITE_DB_PORT!),
      username: process.env.WRITE_DB_USERNAME,
      password: process.env.WRITE_DB_PASSWORD,
      database: process.env.WRITE_DB_DATABASE,
      synchronize: true, // note: In real life we should use migrations
      logging: false,
      entities: [
        EventStoreModel,
        AuditLogModel,
        SnapshotModel,
        OutboxModel,
        ProcessedEventModel,
        RushNameToIdModel,
      ],
    });
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      Logger.info('Write database connection initialized');
    }
  }
  public async destroy(): Promise<void> {
    await this.dataSource.destroy();
  }

  public getRepository<T extends ObjectLiteral>(
    entity: ObjectType<T>,
  ): Repository<T> {
    return this.dataSource.getRepository(entity);
  }
}
