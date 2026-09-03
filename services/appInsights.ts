import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { getAppInsightsInstrumentationKey } from "@/appInsightConfig";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const reactPlugin = new ReactPlugin();
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
