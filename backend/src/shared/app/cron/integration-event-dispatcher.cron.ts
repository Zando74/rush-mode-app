import {OutboxStore} from '../../domain/port/outbox-store.port';
import {Logger} from '../../infra/logger/logger';
import {IntegrationEventBus} from '../event/integration-event-bus';
import {BaseCron} from './base-cron';

export class IntegrationEventDispatcherCron extends BaseCron {
  constructor(
    private readonly integrationEventBus: IntegrationEventBus,
    private readonly outboxStore: OutboxStore,
  ) {
    super(Number(process.env.INTEGRATION_EVENT_BUS_INTERVAL));
  }

  async handle(): Promise<void> {
    const pendingEvents = await this.outboxStore.getPendingEvents();
    if (pendingEvents.length === 0) {
      return;
    }
    try {
      await this.integrationEventBus.publish(pendingEvents);
      await this.outboxStore.acknowledge(pendingEvents);

      Logger.info(
        pendingEvents.length + ' [INTEGRATION-EVENT-BUS] - Events published',
      );
    } catch (e) {
      Logger.error(e, '[INTEGRATION-EVENT-BUS] - Failed to publish events');
    }
  }
}
