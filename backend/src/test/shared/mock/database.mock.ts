/* eslint-disable n/no-unpublished-import */
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {TYPES} from '../../../shared/infra/inversify/type';
import {ReadDatabaseService} from '../../../shared/infra/read-postgresql/init';
import {WriteDatabaseService} from '../../../shared/infra/write-postgresql/init';

export class MockedDatabase {
  static container: StartedPostgreSqlContainer;

  private static async initializeDatasources() {
    process.env.WRITE_DB_HOST = MockedDatabase.container.getHost();
    process.env.WRITE_DB_PORT = MockedDatabase.container.getPort().toFixed();
    process.env.WRITE_DB_USERNAME = MockedDatabase.container.getUsername();
    process.env.WRITE_DB_PASSWORD = MockedDatabase.container.getPassword();
    process.env.WRITE_DB_DATABASE = MockedDatabase.container.getDatabase();

    process.env.READ_DB_HOST = MockedDatabase.container.getHost();
    process.env.READ_DB_PORT = MockedDatabase.container.getPort().toFixed();
    process.env.READ_DB_USERNAME = MockedDatabase.container.getUsername();
    process.env.READ_DB_PASSWORD = MockedDatabase.container.getPassword();
    process.env.READ_DB_DATABASE = MockedDatabase.container.getDatabase();
  }

  public static async startPostgresql(): Promise<void> {
    if (!MockedDatabase.container) {
      MockedDatabase.container = await new PostgreSqlContainer(
        'postgres:14.5-alpine',
      ).start();
      await MockedDatabase.initializeDatasources();
    }
  }

  public static async closeDBConnections() {
    await ContainerManager.get<ReadDatabaseService>(TYPES.ReadDatabaseService)
      .getDataSource()
      .dropDatabase();
    await ContainerManager.get<ReadDatabaseService>(
      TYPES.ReadDatabaseService,
    ).destroy();
    await ContainerManager.get<WriteDatabaseService>(TYPES.WriteDatabaseService)
      .getDataSource()
      .dropDatabase();
    await ContainerManager.get<WriteDatabaseService>(
      TYPES.WriteDatabaseService,
    ).destroy();
  }

  public static async stopPostgresql() {
    if (MockedDatabase.container) {
      await MockedDatabase.container.stop();
    }
  }
}
