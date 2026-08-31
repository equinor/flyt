import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { AppInsightsConfig } from "@/Config";
const reactPlugin = new ReactPlugin();
const key =
  "InstrumentationKey=fe5e08f6-3b9d-4513-8f9c-eedf1f931267;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;ApplicationId=2025dc43-1ce3-4c5d-9c44-850f5a549c1e";
export const appInsights = key
  ? new ApplicationInsights({
      config: {
        connectionString: key,
        extensions: [reactPlugin],
        enableAutoRouteTracking: true,
      },
    })
  : undefined;
if (!appInsights) {
  console.warn("Application Insights connection string not configured");
} else {
  appInsights.loadAppInsights();
}
