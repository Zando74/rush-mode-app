import {IntegrationEvent} from '../../../app/event/integration-event';
import {IntegrationEventBus} from '../../../app/event/integration-event-bus';

export class BaseIntegrationHandler {
  private handlers: Record<string, (event: IntegrationEvent) => Promise<void>> =
    {};

  /* ----------------------------- SUBSCRIBE ----------------------------- */

  subscribe(eventBus: IntegrationEventBus): void {
    Object.keys(this.handlers).forEach(eventType => {
      eventBus.subscribe(eventType, {
        handle: async (event: IntegrationEvent) => await this.handle(event),
      });
    });
  }

  /* ----------------------------- HANDLING ------------------------------ */
  protected on(
    type: string,
    handler: (event: IntegrationEvent) => Promise<void>,
  ) {
    this.handlers[type] = handler;
  }

  private async handle(event: IntegrationEvent) {
    const handler = this.handlers[event.type];
    if (!handler) {
      throw new Error(`No integration handler for ${event.type}`);
    }
    await handler.call(this, event);
  }
}
