import {AggregateId} from './aggregate-id';
import {BoundedContext} from './bounded-context';

export class RushCharactersId extends AggregateId {
  value: {rushId: string; bc: string};
  constructor(rushId: string) {
    super();
    this.value = {rushId: rushId, bc: BoundedContext.Player};
  }
}

export class RushFraudId extends AggregateId {
  value: {rushId: string; bc: string};
  constructor(rushId: string) {
    super();
    this.value = {rushId: rushId, bc: BoundedContext.Fraud};
  }
}

export class RushProgressionId extends AggregateId {
  value: {rushId: string; bc: string};
  constructor(rushId: string) {
    super();
    this.value = {rushId: rushId, bc: BoundedContext.Progression};
  }
}
