import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';
import {RushCharactersReadState} from '../read-state/rush-characters-read-state';

export interface RushCharactersReadModel {
  findById(
    rushCharactersId: AggregateId,
  ): Promise<RushCharactersReadState | null>;
}
