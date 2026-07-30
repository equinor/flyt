import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
const NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING =
  "InstrumentationKey=fe5e08f6-3b9d-4513-8f9c-eedf1f931267;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;ApplicationId=2025dc43-1ce3-4c5d-9c44-850f5a549c1e";

export const reactPlugin = new ReactPlugin();

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
});

appInsights.loadAppInsights();
