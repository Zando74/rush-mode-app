import {EventPayload} from '../event/domain-event';
import {AggregateIdValue} from '../value-object/aggregate-id';
import {BoundedContext} from '../value-object/bounded-context';

export class StoredEvent {
  aggregateId: {value: AggregateIdValue};
  type: string;
  boundedContext: BoundedContext;
  sequenceNumber: number;
  payload: EventPayload;
  occuredAt: Date;
}
