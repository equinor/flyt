import { appInsights } from "./appInsights";

type AnalyticsPayload = {
  processId: string;
  processName?: string;
  canvasName?: string;
  step?: number;
  stage?: string;
};

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
      processName: payload.processName ?? "",
      canvasName: payload.canvasName ?? "",
      step: payload.step?.toString() ?? "",
      stage: payload.stage ?? "",
    }
  );

  console.log("📊 Event Sent:", eventName, payload);
};
