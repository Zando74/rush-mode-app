import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import {RushCharactersId} from '../../../shared/domain/value-object/rush-id';
import {RushCharactersReadModel} from '../../domain/read-model/port/rush-characters-read-model.port';
import {RushCharactersReadState} from '../../domain/read-model/read-state/rush-characters-read-state';

export interface GetRushCharactersQuery {
  rushName: string;
}

export class GetRushCharactersHandler {
  constructor(
    private rushCharactersReadModel: RushCharactersReadModel,
    private rushNameToIdRepository: RushNameToIdRepository,
  ) {}

  async handle(
    query: GetRushCharactersQuery,
  ): Promise<RushCharactersReadState> {
    const rushId = await this.rushNameToIdRepository.getRushIdByName(
      query.rushName,
    );
    if (!rushId) {
      throw new RushNotFoundError(query.rushName);
    }
    const rushCharacters = await this.rushCharactersReadModel.findById(
      new RushCharactersId(rushId.rushId),
    );
    return rushCharacters ?? ({} as RushCharactersReadState);
  }
}
