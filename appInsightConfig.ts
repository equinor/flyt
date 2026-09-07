type AppInsightsEnvironment = "DEV" | "QA" | "PROD" | "TEST";
const instrumentationKeys: Record<AppInsightsEnvironment, string> = {
  DEV: "fe5e08f6-3b9d-4513-8f9c-eedf1f931267",
  QA: "f1516c0b-cb49-4643-b5d8-fb09c7663792",
  PROD: "b01f1bf9-4bf2-494f-bd3c-986517dc4dd1",
  TEST: "f7073bc9-143b-46e2-8380-fe6b656837e8",
};

export const getAppInsightsInstrumentationKey = (
  environment?: string
): string => {
  const normalizedEnvironment =
    environment?.toUpperCase() as AppInsightsEnvironment;
  return instrumentationKeys[normalizedEnvironment] ?? "";
};

export const getAppInsightsConnectionString = getAppInsightsInstrumentationKey;
