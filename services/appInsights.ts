import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import getConfig from "next/config";
const reactPlugin = new ReactPlugin();
const { publicRuntimeConfig } = getConfig();
const connectionString = publicRuntimeConfig.CONNECTION_STRING;

export const appInsights = new ApplicationInsights({
  config: {
    connectionString,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
});

appInsights?.loadAppInsights();
