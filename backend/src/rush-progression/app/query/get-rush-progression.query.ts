import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import {RushProgressionId} from '../../../shared/domain/value-object/rush-id';
import {RushProgressionReadModel} from '../../domain/read-model/port/rush-progression-read-model.port';
import {RushProgressionReadState} from '../../domain/read-model/read-state/rush-progression-read-state';

export interface GetRushProgressionQuery {
  rushName: string;
}

export class GetRushProgressionHandler {
  constructor(
    private rushProgressionReadModel: RushProgressionReadModel,
    private rushNameToIdRepository: RushNameToIdRepository,
  ) {}

  async handle(
    query: GetRushProgressionQuery,
  ): Promise<RushProgressionReadState> {
    const rushId = await this.rushNameToIdRepository.getRushIdByName(
      query.rushName,
    );
    if (!rushId) {
      throw new RushNotFoundError(query.rushName);
    }
    const rushProgression = await this.rushProgressionReadModel.findById(
      new RushProgressionId(rushId.rushId),
    );
    return rushProgression ?? ({} as RushProgressionReadState);
  }
}
