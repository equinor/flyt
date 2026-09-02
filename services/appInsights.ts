import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import getConfig from "next/config";
import { getAppInsightsInstrumentationKey } from "../appinsightsConfig";

const reactPlugin = new ReactPlugin();
const { publicRuntimeConfig } = getConfig();
const instrumentationKey = getAppInsightsInstrumentationKey(
  publicRuntimeConfig.ENVIRONMENT
);

export const appInsights = instrumentationKey
  ? new ApplicationInsights({
      config: {
        instrumentationKey,
        extensions: [reactPlugin],
        enableAutoRouteTracking: true,
      },
    })
  : undefined;

appInsights?.loadAppInsights();
