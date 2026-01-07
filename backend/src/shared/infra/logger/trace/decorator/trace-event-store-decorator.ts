import {Tracer} from '../tracer';

export function Traceable(): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const className = target.constructor.name;
      const methodName = String(propertyKey);
      const traceName = `${className}.${methodName}`;

      return Tracer.startTrace(traceName, async () => {
        return await original.apply(this, args);
      });
    };

    return descriptor;
  };
}
