import {DomainEvent} from '../../domain/event/domain-event';

export const applyCorrelationIdToEvents = (
  correlationId: string,
  events: DomainEvent[],
): DomainEvent[] => {
  for (const event of events) {
    event.correlationId = correlationId;
  }
  return events;
};
