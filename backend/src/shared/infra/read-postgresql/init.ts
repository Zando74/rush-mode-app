import {DataSource, ObjectLiteral, ObjectType, Repository} from 'typeorm';

import {Logger} from '../logger/logger';
import {RushCharactersProjection} from '../../../rush-characters/infra/read-postgresql/projection/rush-characters.projection';
import {RushFraudProjection} from '../../../rush-fraud/infra/read-postgresql/projection/rush-fraud.projection';
import {RushProgressionProjection} from '../../../rush-progression/infra/read-postgresql/projection/rush-progression.projection';

export class ReadDatabaseService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.READ_DB_HOST,
      port: parseInt(process.env.READ_DB_PORT!),
      username: process.env.READ_DB_USERNAME,
      password: process.env.READ_DB_PASSWORD,
      database: process.env.READ_DB_DATABASE,
      synchronize: true, // note: In real life we should use migrations
      logging: false,
      entities: [
        RushCharactersProjection,
        RushFraudProjection,
        RushProgressionProjection,
      ],
    });
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      Logger.info('Read database connection initialized');
      await this.dataSource.initialize();
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
