import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {RushFraudReadModel} from '../../domain/read-model/port/rush-fraud-read-model.port';
import {RushFraudReadState} from '../../domain/read-model/read-state/rush-fraud-read-state';

export interface GetRushFraudQuery {
  rushName: string;
}

export class GetRushFraudHandler {
  constructor(
    private rushFraudReadModel: RushFraudReadModel,
    private rushNameToIdRepository: RushNameToIdRepository,
  ) {}

  async handle(query: GetRushFraudQuery): Promise<RushFraudReadState> {
    const rushId = await this.rushNameToIdRepository.getRushIdByName(
      query.rushName,
    );
    if (!rushId) {
      throw new RushNotFoundError(query.rushName);
    }
    const rushFraud = await this.rushFraudReadModel.findById(
      new RushFraudId(rushId.rushId),
    );
    return rushFraud ?? ({} as RushFraudReadState);
  }
}
