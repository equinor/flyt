import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { AppInsightsConfig } from "@/Config";
const reactPlugin = new ReactPlugin();
const key = AppInsightsConfig.connectionString;

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
