/* eslint-disable n/no-unpublished-import */
import {
  RabbitMQContainer,
  StartedRabbitMQContainer,
} from '@testcontainers/rabbitmq';
import ContainerManager from '../../../shared/infra/inversify/container-manager';
import {RabbitMQService} from '../../../shared/infra/rabbit-mq/init';
import {TYPES} from '../../../shared/infra/inversify/type';

export class MockedMessagingService {
  static container: StartedRabbitMQContainer;

  public static async startRabbitmq(): Promise<void> {
    if (!MockedMessagingService.container) {
      MockedMessagingService.container = await new RabbitMQContainer(
        'rabbitmq:3.12.11-management-alpine',
      ).start();

      process.env.RABBITMQ_URL = MockedMessagingService.container.getAmqpUrl();
    }
  }

  public static async closeRabbitmqConnection() {
    await ContainerManager.get<RabbitMQService>(
      TYPES.MessagingService,
    ).destroy();
  }

  public static async stopRabbitmq() {
    if (MockedMessagingService.container) {
      await MockedMessagingService.container.stop();
    }
  }
}
