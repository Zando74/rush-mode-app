/* eslint-disable n/no-unpublished-import */
import {After, AfterAll, Before} from '@cucumber/cucumber';
import {GlobalWorld} from './global-world';
import {MockedDatabase} from '../mock/database.mock';
import {MockedMessagingService} from '../mock/messaging.mock';

Before({tags: 'not @real-infrastructure and not @adapter'}, async () => {});

Before(
  {tags: '@real-infrastructure or @adapter', timeout: 60 * 1000},
  async function (this: GlobalWorld) {
    await MockedDatabase.startPostgresql();
    await MockedMessagingService.startRabbitmq();
    await this.enableInfraRepositories();
  },
);

After({tags: '@real-infrastructure or @cli'}, async () => {
  await MockedDatabase.closeDBConnections();
  await MockedMessagingService.closeRabbitmqConnection();
});

AfterAll(async () => {
  await MockedDatabase.stopPostgresql();
  await MockedMessagingService.stopRabbitmq();
});
