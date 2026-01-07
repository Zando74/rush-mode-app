import {DomainEventBus} from '../../port/domain-event-bus';

export interface InlineProjectionHandler {
  subscribeCritical(eventBus: DomainEventBus): void;
}
