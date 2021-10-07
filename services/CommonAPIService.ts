export const getServiceMessage = async (
  environment: string,
  serviceName: string
): Promise<{
  status: boolean;
  serviceName: string;
  alertName: string;
  message: string;
  urlString: string;
  fromDate: string;
  toDate: string;
}> => {
  const url =
    environment === "PROD"
      ? `https://api.statoil.com/app/mad/api/v1/ServiceMessage/${serviceName}`
      : `https://api.statoil.com/app/mad/${environment}/api/v1/ServiceMessage/${serviceName}`;
  return fetch(url).then((r) => r.ok && r.json());
};
