import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

const reactPlugin = new ReactPlugin();
const instrumentationKey = process.env.NEXT_PUBLIC_INSTRUMENTATION_KEY;

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
