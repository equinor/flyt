import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

const appInsightsConnectionString =
  process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;

if (!appInsightsConnectionString) {
  console.error(
    "Application Insights connection string is not defined. Please set the NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING environment variable."
  );
}

export const reactPlugin = new ReactPlugin();

export const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: appInsightsConnectionString,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
});

appInsights.loadAppInsights();
