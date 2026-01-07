import {Repository} from 'typeorm';
import {SnapshotModel} from '../model/snapshot.model';
import {WriteDatabaseService} from '../init';
import {AggregateId} from '../../../domain/value-object/aggregate-id';
import {Logger} from '../../logger/logger';
import {Traceable} from '../../logger/trace/decorator/trace-event-store-decorator';

export class PgSnapshotRepository {
  private repo: Repository<SnapshotModel>;

  constructor(db: WriteDatabaseService) {
    this.repo = db.getRepository(SnapshotModel);
    Logger.info('Snapshot repository initialized');
  }

  @Traceable()
  async getLastSnapshot(
    aggregateId: AggregateId,
  ): Promise<SnapshotModel | null> {
    return this.repo.findOne({
      where: {identityHash: AggregateId.getIdentityHash(aggregateId)},
      order: {lastSequenceNumber: 'DESC'},
    });
  }

  @Traceable()
  async delete(aggregateId: AggregateId): Promise<void> {
    await this.repo.delete({
      identityHash: AggregateId.getIdentityHash(aggregateId),
    });
  }
}
