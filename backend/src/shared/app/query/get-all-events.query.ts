import {StoredEvent} from '../../domain/entity/stored-event';
import {AuditLog} from '../../domain/port/audit-log.port';
import {AggregateId} from '../../domain/value-object/aggregate-id';

export interface GetAllEventsQuery {
  aggregateId: AggregateId;
  from: Date;
  to: Date;
}

export class GetRushCharactersHandler {
  constructor(private auditLogRepository: AuditLog) {}

  async handle(query: GetAllEventsQuery): Promise<StoredEvent[]> {
    const events = await this.auditLogRepository.findByAggregateId(
      query.aggregateId,
      query.from,
      query.to,
    );
    return events;
  }
}
