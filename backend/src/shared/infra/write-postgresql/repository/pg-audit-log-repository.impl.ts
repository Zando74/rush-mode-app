import {Between, Repository} from 'typeorm';
import {WriteDatabaseService} from '../init';
import {Logger} from '../../logger/logger';
import {AggregateId} from '../../../domain/value-object/aggregate-id';
import {Traceable} from '../../logger/trace/decorator/trace-event-store-decorator';
import {AuditLog} from '../../../domain/port/audit-log.port';
import {AuditLogModel} from '../model/audit-log.model';
import {StoredEvent} from '../../../domain/entity/stored-event';

export class PgAuditStoreRepository implements AuditLog {
  private repo: Repository<AuditLogModel>;

  constructor(databaseService: WriteDatabaseService) {
    this.repo = databaseService.getRepository(AuditLogModel);
    Logger.info('audit log repository initialized');
  }

  @Traceable()
  async findByAggregateId(
    aggregateId: AggregateId,
    from: Date,
    to: Date,
  ): Promise<StoredEvent[]> {
    const auditLogs = await this.repo.find({
      where: {
        identityHash: AggregateId.getIdentityHash(aggregateId),
        occuredAt: Between(from, to),
      },
    });
    return auditLogs.map(auditLog => ({
      aggregateId: auditLog.aggregateId,
      type: auditLog.type,
      boundedContext: auditLog.boundedContext,
      sequenceNumber: auditLog.sequenceNumber,
      payload: auditLog.payload,
      occuredAt: auditLog.occuredAt,
    }));
  }
}
