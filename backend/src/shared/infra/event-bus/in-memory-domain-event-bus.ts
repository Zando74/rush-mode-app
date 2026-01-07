import {BaseSyncEventBusInMemory} from './base-sync-event-bus';

export const WildWardHandlerSymbol = '*';
export const ThrowableHandlerSymbol = '!';

export class DomainEventBusInMemory extends BaseSyncEventBusInMemory {}
