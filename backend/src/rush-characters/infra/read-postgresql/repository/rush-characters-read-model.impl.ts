import {Repository} from 'typeorm';
import {RushCharactersReadModel} from '../../../domain/read-model/port/rush-characters-read-model.port';
import {RushCharactersProjection} from '../projection/rush-characters.projection';
import {ReadDatabaseService} from '../../../../shared/infra/read-postgresql/init';
import {Traceable} from '../../../../shared/infra/logger/trace/decorator/trace-event-store-decorator';
import {RushCharactersId} from '../../../../shared/domain/value-object/rush-id';
import {RushCharactersReadState} from '../../../domain/read-model/read-state/rush-characters-read-state';
import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';

export class RushCharactersReadModelImpl implements RushCharactersReadModel {
  private rushCharactersRepo: Repository<RushCharactersProjection>;

  constructor(databaseService: ReadDatabaseService) {
    this.rushCharactersRepo = databaseService.getRepository(
      RushCharactersProjection,
    );
  }

  @Traceable()
  async findById(
    rushCharactersId: RushCharactersId,
  ): Promise<RushCharactersReadState | null> {
    const projection = await this.rushCharactersRepo.findOneBy({
      id: AggregateId.getIdentityHash(rushCharactersId),
    });
    if (!projection) {
      return null;
    }
    return {
      id: projection.id,
      name: projection.name,
      characters: projection.characters,
      open: projection.open,
    };
  }
}
