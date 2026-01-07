import {DomainEvent} from '../../domain/event/domain-event';
import {
  DomainEventBus,
  DomainEventHandler,
} from '../../domain/port/domain-event-bus';

import {TraceableDomainEvent} from '../logger/trace/decorator/trace-domain-event-decorator';

export const WildWardHandlerSymbol = '*';
export const ThrowableHandlerSymbol = '!';

export class BaseSyncEventBusInMemory implements DomainEventBus {
  private criticalHandlers: Map<string, DomainEventHandler[]> = new Map();
  private nonCriticalHandlers: Map<string, DomainEventHandler[]> = new Map();

  async publish(events: DomainEvent[]) {
    for (const event of events) {
      await this.processEvent(event);
    }
  }

  @TraceableDomainEvent()
  private async processEvent(event: DomainEvent) {
    await this.publishNonCritical(event);
    await this.publishCritical(event);
  }

  private async publishNonCritical(event: DomainEvent) {
    const handlers = this.nonCriticalHandlers.get(event.type);
    const wildCardHandlers = this.nonCriticalHandlers.get(
      WildWardHandlerSymbol,
    );
    if (wildCardHandlers) {
      for (const handler of wildCardHandlers) {
        await handler.handle(event);
      }
    }
    if (!handlers) {
      return;
    }
    for (const handler of handlers) {
      await handler.handle(event);
    }
  }

  private async publishCritical(event: DomainEvent) {
    const handlers = this.criticalHandlers.get(event.type);
    const wildCardHandlers = this.criticalHandlers.get(WildWardHandlerSymbol);
    if (wildCardHandlers) {
      for (const handler of wildCardHandlers) {
        await handler.handle(event);
      }
    }
    if (!handlers) {
      return;
    }
    for (const handler of handlers) {
      await handler.handle(event);
    }
  }

  subscribeCritical(eventName: string, handler: DomainEventHandler): void {
    if (!this.criticalHandlers.has(eventName)) {
      this.criticalHandlers.set(eventName, []);
    }

    this.criticalHandlers.get(eventName)!.push(handler);
  }

  subscribeNonCritical(eventName: string, handler: DomainEventHandler): void {
    if (!this.nonCriticalHandlers.has(eventName)) {
      this.nonCriticalHandlers.set(eventName, []);
    }

    this.nonCriticalHandlers.get(eventName)!.push(handler);
  }
}
