import {AggregateId} from '../../../../shared/domain/value-object/aggregate-id';
import {RushFraudReadState} from '../read-state/rush-fraud-read-state';

export interface RushFraudReadModel {
  findById(rushFraudId: AggregateId): Promise<RushFraudReadState | null>;
}
