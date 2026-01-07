import amqp, {ConfirmChannel} from 'amqplib';
import {IntegrationEvent} from '../../app/event/integration-event';
import {
  IntegrationEventBus,
  IntegrationEventHandler,
} from '../../app/event/integration-event-bus';
import {EXCHANGE_NAME} from '../rabbit-mq/init';
import {Logger} from '../logger/logger';
import {ProcessedEvent} from '../../domain/port/processed-event.port';

export class RabbitMQIntegrationEventBus implements IntegrationEventBus {
  constructor(
    private channel: ConfirmChannel,
    private readonly processedEvent: ProcessedEvent,
  ) {}

  async publish(events: IntegrationEvent[]): Promise<void> {
    for (const event of events) {
      const routingKey = event.type;

      const payload = Buffer.from(JSON.stringify(event));

      try {
        const success = this.channel.publish(
          EXCHANGE_NAME,
          routingKey,
          payload,
          {
            persistent: true,
            messageId: event.eventId,
            timestamp: event.occuredAt.getTime(),
            contentType: 'application/json',
            correlationId: event.correlationId,
            mandatory: true,
          },
        );

        if (!success) {
          throw new Error(
            `RabbitMQ publish failed due to backpressure (routingKey: ${routingKey}).`,
          );
        }
      } catch (error) {
        Logger.error(error);
        await this.reinitializeConnection();
      }
    }
  }

  private async consumeEvent(
    msg: amqp.ConsumeMessage | null,
    handler: IntegrationEventHandler,
  ) {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());
    if (await this.processedEvent.isAlreadyProcessedEvent(event.eventId)) {
      return;
    }

    await handler.handle(event);

    await this.processedEvent.save(event.eventId);

    this.channel.ack(msg);
  }

  async subscribe(eventType: string, handler: IntegrationEventHandler) {
    const queue = await this.channel.assertQueue(eventType);
    await this.channel.bindQueue(queue.queue, EXCHANGE_NAME, eventType);
    await this.channel.consume(queue.queue, async msg => {
      await this.consumeEvent(msg, handler);
    });
  }

  private async reinitializeConnection() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    this.channel = await connection.createConfirmChannel();
  }
}
