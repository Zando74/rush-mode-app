import {AggregateSnapshot} from '../entity/base-es-root-aggregate';
import {DomainEvent} from '../event/domain-event';
import {AggregateId} from '../value-object/aggregate-id';

export interface EventStore {
  loadFromLatestSnapshot<T>(
    aggregateId: AggregateId,
  ): Promise<{events: DomainEvent[]; snapshot?: AggregateSnapshot<T>}>;
  loadAllHistory(aggregateId: AggregateId): Promise<DomainEvent[]>;
  save<T>(
    aggregateId: AggregateId,
    events: DomainEvent[],
    aggregateStateAfterApply: AggregateSnapshot<T>,
    aggregateType: string,
  ): Promise<void>;
  delete(aggregateId: AggregateId): Promise<void>;
}
