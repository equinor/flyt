import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { getAppInsightsInstrumentationKey } from "@/appInsightConfig";

const reactPlugin = new ReactPlugin();
const instrumentationKey = getAppInsightsInstrumentationKey(
  process.env.ENVIRONMENT
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
