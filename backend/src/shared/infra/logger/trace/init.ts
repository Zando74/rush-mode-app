import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http';
import {NodeSDK} from '@opentelemetry/sdk-node';
import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';

const exporter = new OTLPTraceExporter({
  url: process.env.EXPORTER_OTLP_ENDPOINT,
});
const sdk = new NodeSDK({
  traceExporter: exporter,
  spanProcessor: new SimpleSpanProcessor(exporter),
  instrumentations: [new HttpInstrumentation()],
  serviceName: 'rush-mode-app',
});

sdk.start();
