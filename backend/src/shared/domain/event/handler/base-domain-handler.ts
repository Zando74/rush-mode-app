import {WildWardHandlerSymbol} from '../../../infra/event-bus/in-memory-domain-event-bus';
import {Logger} from '../../../infra/logger/logger';
import {DomainEventBus} from '../../port/domain-event-bus';
import {DomainEvent} from '../domain-event';

export class BaseDomainHandler {
  private handlers: Record<string, (event: DomainEvent) => Promise<void>> = {};

  constructor() {}

  /* ----------------------------- SUBSCRIBE ----------------------------- */
  subscribeCritical(eventBus: DomainEventBus): void {
    Object.keys(this.handlers).forEach(eventType => {
      eventBus.subscribeCritical(eventType, {
        handle: async (event: DomainEvent) => await this.handle(event),
      });
    });
  }

  subscribeNonCritical(eventBus: DomainEventBus): void {
    Object.keys(this.handlers).forEach(eventType => {
      eventBus.subscribeNonCritical(eventType, {
        handle: async (event: DomainEvent) => {
          try {
            await this.handle(event);
          } catch (e) {
            Logger.error(e, `Non-critical handler failed for ${event.type}`);
          }
        },
      });
    });
  }

  /* ----------------------------- HANDLING ------------------------------ */
  protected on(type: string, handler: (event: DomainEvent) => Promise<void>) {
    this.handlers[type] = handler;
  }

  private async handle(event: DomainEvent) {
    const wildCardHandler = this.handlers[WildWardHandlerSymbol];
    if (wildCardHandler) {
      await wildCardHandler.call(this, event);
    } else {
      const handler = this.handlers[event.type];
      if (!handler) {
        throw new Error(`No handler registered for ${event.type}`);
      }
      await handler.call(this, event);
    }
  }
}
