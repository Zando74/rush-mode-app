import {DomainEvent} from '../../../../domain/event/domain-event';
import {Tracer} from '../tracer';

export function TraceableDomainEvent(): MethodDecorator {
  return function (_target, _propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const event = args[0] as DomainEvent;
      const traceName = `processing.${event.type}`;

      return Tracer.startTrace(traceName, async () => {
        return await original.apply(this, args);
      }, [{event: args[0]}]);
    };

    return descriptor;
  };
}
