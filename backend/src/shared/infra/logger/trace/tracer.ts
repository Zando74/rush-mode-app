import './init';
import {context, trace} from '@opentelemetry/api';
import {Logger} from '../logger';

export class Tracer {
  private static tracer = trace.getTracer('survival-kit');

  private static isTestEnv() {
    return process.env.NODE_ENV === 'test';
  }

  static startTrace(
    name: string,
    fn: () => Promise<void>,
    options?: unknown[],
  ) {
    if (this.isTestEnv()) {
      return fn();
    }

    try {
      const span = this.tracer.startSpan(name);
      if (options) {
        span.setAttributes({args: JSON.stringify(options)});
      }
      const ctx = trace.setSpan(context.active(), span);

      return context.with(ctx, async () => {
        try {
          return await fn();
        } finally {
          span.end();
        }
      });
    } catch (error) {
      Logger.warn('[TRACE] - Failed to start trace');
      return fn();
    }
  }
}
