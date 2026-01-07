import {DomainEvent} from '../../../shared/domain/event/domain-event';
import {BoundedContext} from '../../../shared/domain/value-object/bounded-context';
import {RushFraudId} from '../../../shared/domain/value-object/rush-id';
import {MailEntityProps} from '../entity/mail.entity';

export const RushFraudMailRegisteredEventType = 'RushFraudMailRegisteredEvent';

export type RushFraudMailRegisteredEventPayload = {
  mail: MailEntityProps;
};

export class RushFraudMailRegisteredEvent
  implements DomainEvent<RushFraudMailRegisteredEventPayload>
{
  occuredAt: Date = new Date();
  sequenceNumber: 0;
  correlationId = '';
  constructor(
    public readonly aggregateId: RushFraudId,
    public readonly payload: RushFraudMailRegisteredEventPayload,
    public readonly type: string = RushFraudMailRegisteredEventType,
    public readonly boundedContext = BoundedContext.Fraud,
  ) {}
}
