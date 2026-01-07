import {RushNotFoundError} from '../../../shared/domain/error/rush-not-found.error';
import {RushNameToIdRepository} from '../../../shared/domain/port/rush-name-to-id-repository';

export interface GetRushNamesQuery {}

export class GetRushNamesHandler {
  constructor(private rushNameToIdRepository: RushNameToIdRepository) {}

  async handle(query: GetRushNamesQuery): Promise<string[]> {
    const allRushesNames = await this.rushNameToIdRepository.getAllRushNames();
    return allRushesNames;
  }
}
