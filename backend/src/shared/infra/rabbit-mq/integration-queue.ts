import {RushCharactersAggregateType} from '../../../rush-characters/domain/entity/rush-characters.aggregate';
import {RushFraudAggregateType} from '../../../rush-fraud/domain/entity/rush-fraud.aggregate';
import {RushProgressionAggregateType} from '../../../rush-progression/domain/entity/rush-progression.aggregate';

export const INTEGRATION_EVENT_TYPES = [];
export const PROJECTION_EVENT_TYPES = [
  RushCharactersAggregateType,
  RushFraudAggregateType,
  RushProgressionAggregateType,
];
