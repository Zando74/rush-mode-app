import amqp, {ConfirmChannel, ChannelModel} from 'amqplib';
import {Logger} from '../logger/logger';
import {
  INTEGRATION_EVENT_TYPES,
  PROJECTION_EVENT_TYPES,
} from './integration-queue';

export const EXCHANGE_NAME = 'integration-events';

export class RabbitMQService {
  private connection: ChannelModel;
  private channel: ConfirmChannel;

  constructor() {}

  private async initIntegrationEventQueues() {
    for (const eventType of INTEGRATION_EVENT_TYPES) {
      const queueName = eventType;

      await this.channel.assertQueue(queueName, {
        durable: true,
      });
    }
  }

  private async initProjectionIntegrationEventQueues() {
    for (const eventType of PROJECTION_EVENT_TYPES) {
      const queueName = eventType;

      await this.channel.assertQueue(queueName, {
        durable: true,
      });
    }
  }

  async initialize() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
    this.channel = await this.connection.createConfirmChannel();

    await this.channel.assertExchange(EXCHANGE_NAME, 'topic', {
      durable: true,
    });
    await this.initIntegrationEventQueues();
    await this.initProjectionIntegrationEventQueues();

    Logger.info('Message queue client initialized');
  }

  getChannel() {
    return this.channel;
  }

  async destroy(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
