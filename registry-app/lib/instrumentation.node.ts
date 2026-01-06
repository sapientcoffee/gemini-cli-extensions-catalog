import { NodeSDK } from '@opentelemetry/sdk-node';
import { getRequestSpanVerifier, getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'registry-app',
  }),
  traceExporter: new TraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
