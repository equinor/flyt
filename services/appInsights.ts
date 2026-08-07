import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

const appInsightsConnectionString =
  process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING?.trim();

if (!appInsightsConnectionString) {
  throw new Error(
    "NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING is required in environment variables"
  );
}

export const reactPlugin = new ReactPlugin();

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: appInsightsConnectionString,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
});

appInsights.loadAppInsights();
