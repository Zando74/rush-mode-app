import {AggregateId} from '../value-object/aggregate-id';
import {BoundedContext} from '../value-object/bounded-context';

export interface EventPayload {
  [key: string]: unknown;
}

export interface DomainEvent<T extends EventPayload = EventPayload> {
  readonly occuredAt: Date;
  readonly aggregateId: AggregateId;
  correlationId: string;
  sequenceNumber: number;
  readonly type: string;
  readonly payload: T;
  readonly boundedContext: BoundedContext;
}
