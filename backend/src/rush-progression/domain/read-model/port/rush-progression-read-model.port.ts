import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';
import {RushProgressionReadState} from '../read-state/rush-progression-read-state';

export interface RushProgressionReadModel {
  findById(
    rushProgressionId: AggregateId,
  ): Promise<RushProgressionReadState | null>;
}
