import {Repository} from 'typeorm';
import {RushFraudReadModel} from '../../../domain/read-model/port/rush-fraud-read-model.port';
import {RushFraudProjection} from '../projection/rush-fraud.projection';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {Traceable} from '../../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushFraudId} from '../../../../shared/domain/value-object/rush-id';
import {RushFraudReadState} from '../../../domain/read-model/read-state/rush-fraud-read-state';
import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';

export class RushFraudReadModelImpl implements RushFraudReadModel {
  private rushFraudRepo: Repository<RushFraudProjection>;

  constructor(databaseService: ReadDatabaseService) {
    this.rushFraudRepo = databaseService.getRepository(RushFraudProjection);
  }

  @Traceable()
  async findById(rushFraudId: RushFraudId): Promise<RushFraudReadState | null> {
    const projection = await this.rushFraudRepo.findOneBy({
      id: AggregateId.getIdentityHash(rushFraudId),
    });
    if (!projection) {
      return null;
    }
    return {
      id: projection.id,
      name: projection.name,
      mails: projection.mails,
      trades: projection.trades,
      open: projection.open,
    };
  }
}
