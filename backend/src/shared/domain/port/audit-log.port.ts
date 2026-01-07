import {StoredEvent} from '../entity/stored-event';
import {AggregateId} from '../value-object/aggregate-id';

export interface AuditLog {
  findByAggregateId(
    aggregateId: AggregateId,
    from: Date,
    to: Date,
  ): Promise<StoredEvent[]>;
}
