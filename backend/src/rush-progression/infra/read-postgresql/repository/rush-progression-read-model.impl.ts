import {Repository} from 'typeorm';
import {RushProgressionReadModel} from '../../../domain/read-model/port/rush-progression-read-model.port';
import {RushProgressionProjection} from '../projection/rush-progression.projection';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {Traceable} from '../../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushProgressionId} from '../../../../shared/domain/value-object/rush-id';
import {RushProgressionReadState} from '../../../domain/read-model/read-state/rush-progression-read-state';
import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';

export class RushProgressionReadModelImpl implements RushProgressionReadModel {
  private rushProgressionRepo: Repository<RushProgressionProjection>;

  constructor(databaseService: ReadDatabaseService) {
    this.rushProgressionRepo = databaseService.getRepository(
      RushProgressionProjection,
    );
  }

  @Traceable()
  async findById(
    rushProgressionId: RushProgressionId,
  ): Promise<RushProgressionReadState | null> {
    const projection = await this.rushProgressionRepo.findOneBy({
      id: AggregateId.getIdentityHash(rushProgressionId),
    });
    if (!projection) {
      return null;
    }
    return {
      id: projection.id,
      name: projection.name,
      progressions: projection.progressions,
      open: projection.open,
    };
  }
}
