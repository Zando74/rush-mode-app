import {DomainEvent} from '../../domain/event/domain-event';
import {BaseDomainHandler} from '../../domain/event/handler/base-domain-handler';
import {DomainEventBus} from '../../domain/port/domain-event-bus';
import {WildWardHandlerSymbol} from '../event-bus/base-sync-event-bus';
import {Logger} from '../logger/logger';

export class LoggingDomainEventHandler extends BaseDomainHandler {
  constructor(eventBus: DomainEventBus) {
    super();
    this.on(WildWardHandlerSymbol, async event => await this.onEvent(event));
    this.subscribeNonCritical(eventBus);
  }

  async onEvent(event: DomainEvent) {
    Logger.info(event, '[DOMAIN] - Event emitted');
  }
}
