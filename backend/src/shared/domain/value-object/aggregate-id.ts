import {createHash} from 'crypto';

export interface AggregateIdValue {
  [key: string]: unknown;
}

export abstract class AggregateId {
  value: AggregateIdValue;

  static getIdentityHash(aggregateId: AggregateId): string {
    const sortedValue = Object.keys(aggregateId.value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = aggregateId.value[key];
        return acc;
      }, {} as AggregateIdValue);

    return createHash('sha256')
      .update(JSON.stringify(sortedValue))
      .digest('hex');
  }
}
