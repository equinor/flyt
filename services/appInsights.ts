import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { AppInsightsConfig } from "@/Config";
const reactPlugin = new ReactPlugin();
const key = AppInsightsConfig.connectionString;

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: key,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
});
console.log("Connection String Exists:", !!key);
appInsights?.loadAppInsights();
