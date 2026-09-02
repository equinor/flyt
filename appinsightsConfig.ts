type AppInsightsEnvironment = "DEV" | "QA" | "PROD" | "TEST";
const dev = "fe5e08f6-3b9d-4513-8f9c-eedf1f931267";
const prod = "b01f1bf9-4bf2-494f-bd3c-986517dc4dd1";
const instrumentationKeys: Record<AppInsightsEnvironment, string> = {
  DEV: dev,
  QA: dev,
  PROD: prod,
  TEST: dev,
};

export const getAppInsightsInstrumentationKey = (
  environment?: string
): string => {
  const normalizedEnvironment =
    environment?.toUpperCase() as AppInsightsEnvironment;
  return instrumentationKeys[normalizedEnvironment] ?? "";
};

export const getAppInsightsConnectionString = getAppInsightsInstrumentationKey;
