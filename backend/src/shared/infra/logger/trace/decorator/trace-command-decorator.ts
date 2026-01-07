import {Tracer} from '../tracer';

export function TraceableCommand(): MethodDecorator {
  return function (target, _propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const traceName = `${target.constructor.name}}`;

      return await Tracer.startTrace(traceName, async () => {
        return await original.apply(this, args);
      }, [{command: args}]);
    };

    return descriptor;
  };
}
