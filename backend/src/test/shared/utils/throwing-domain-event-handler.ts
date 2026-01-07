import {BaseDomainHandler} from '../../../shared/domain/event/handler/base-domain-handler';
import {DomainEventBus} from '../../../shared/domain/port/domain-event-bus';
import {WildWardHandlerSymbol} from '../../../shared/infra/event-bus/base-sync-event-bus';

export class ThrowingNonCriticalDomainEventHandler extends BaseDomainHandler {
  constructor(eventBus: DomainEventBus) {
    super();
    this.on(WildWardHandlerSymbol, async () => await this.onEvent());
    this.subscribeNonCritical(eventBus);
  }

  async onEvent() {
    throw new Error('Non critical handler failed ');
  }
}
