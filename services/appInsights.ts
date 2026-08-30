import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import getConfig from "next/config";
const reactPlugin = new ReactPlugin();
const { publicRuntimeConfig } = getConfig();
const instrumentationKey = publicRuntimeConfig.INSTRUMENTATION_KEY;

export const appInsights =
  typeof window !== "undefined" && instrumentationKey
    ? new ApplicationInsights({
        config: {
          instrumentationKey,
          extensions: [reactPlugin],
          enableAutoRouteTracking: true,
        },
      })
    : undefined;

appInsights?.loadAppInsights();
