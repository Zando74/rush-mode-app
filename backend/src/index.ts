import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {NodeSDK} from '@opentelemetry/sdk-node';
import {SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http';
import {CheckEnvVariables} from './shared/infra/env/env-loader';

import dotenv from 'dotenv';
import {StartRushCharactersApplication} from './rush-characters/application';
import {StartRushFraudApplication} from './rush-fraud/application';
import {fakeDemoApp} from './test/shared/fake/fake-app';
import ContainerManager from './shared/infra/inversify/container-manager';
import {StartRushProgressionApplication} from './rush-progression/application';
import {StartGatewayApplication} from './gateway/application';
dotenv.config();

if (process.env.NODE_ENV !== 'test') {
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
}

const main = async () => {
  CheckEnvVariables();
  await ContainerManager.initializeSharedResources();
  await StartRushCharactersApplication();
  await StartRushFraudApplication();
  await StartRushProgressionApplication();
  await StartGatewayApplication();
  if (process.env.ENABLE_DEMO === 'true') {
    void fakeDemoApp();
  }
};

void main();
