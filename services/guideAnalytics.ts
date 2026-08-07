import { appInsights } from "./appInsights";

type AnalyticsPayload = {
  processId: string;
  step?: number;
  stage?: string;
};
export const GUIDE_EVENTS = {
  NOT_STARTED: "OptionalGuideNotStarted",
  COMPLETED: "OptionalGuideCompleted",
  SKIPPED: "OptionalGuideSkipped",
} as const;
export const trackGuideEvent = (
  eventName: string,
  payload: AnalyticsPayload
) => {
  appInsights.trackEvent(
    {
      name: eventName,
    },
    {
      processId: payload.processId,
      step: payload.step?.toString() ?? "",
      stage: payload.stage ?? "",
    }
  );
};
