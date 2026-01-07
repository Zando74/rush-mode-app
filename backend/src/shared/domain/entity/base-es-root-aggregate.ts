import {UnhandledDomainEventError} from '../error/unhandled-domain-event.error';
import {DomainEvent} from '../event/domain-event';
import {AggregateId} from '../value-object/aggregate-id';

export interface AggregateSnapshot<T> {
  id: AggregateId;
  version: number;
  state: T;
}

export abstract class BaseEsRootAggregate<T> {
  id: AggregateId;
  private version = 0;
  protected uncommitted: DomainEvent[] = [];
  private handlers: Record<string, (event: DomainEvent) => void> = {};

  protected on(type: string, handler: (event: DomainEvent) => void) {
    this.handlers[type] = handler;
  }

  protected raise(event: DomainEvent) {
    event.sequenceNumber = this.version + 1;
    this.apply(event);
    this.uncommitted.push(event);
  }

  protected apply(event: DomainEvent): void {
    const handler = this.handlers[event.type];

    if (!handler) {
      throw new UnhandledDomainEventError(event.type);
    }

    handler.call(this, event);
    this.version++;
  }

  protected abstract serialize(): T;
  protected abstract deserialize(state: T): void;
  abstract createEvent(...args: unknown[]): DomainEvent;

  toSnapshot(): AggregateSnapshot<T> {
    return {
      id: this.id,
      version: this.version,
      state: this.serialize(),
    };
  }

  protected loadSnapshot(snapshot: AggregateSnapshot<T>) {
    this.id = snapshot.id;
    this.version = snapshot.version;
    this.uncommitted = [];
    this.deserialize(snapshot.state);
  }

  /* -------------------- FACTORY -------------------- */

  static rehydrate<A extends BaseEsRootAggregate<unknown>, B>(
    ctor: {new (): A},
    events: DomainEvent[],
    snapshot?: object,
  ): A {
    const agg = new ctor();

    if (snapshot) {
      agg.loadSnapshot(snapshot as AggregateSnapshot<B>);
    }

    for (const evt of events.sort(
      (a, b) => a.sequenceNumber - b.sequenceNumber,
    )) {
      agg.apply(evt);
    }
    return agg;
  }

  protected static genericCreate<A extends BaseEsRootAggregate<unknown>>(
    ctor: new () => A,
    args: Parameters<A['createEvent']>,
  ): {aggregate: A; events: DomainEvent[]} {
    const agg = new ctor();
    const evt = agg.createEvent(...args);
    agg.raise(evt);
    return {aggregate: agg, events: agg.uncommitted};
  }

  static create<A extends BaseEsRootAggregate<unknown>>(
    ctor: {new (): A},
    ...args: Parameters<A['createEvent']>
  ) {
    return BaseEsRootAggregate.genericCreate(ctor, args);
  }
}
