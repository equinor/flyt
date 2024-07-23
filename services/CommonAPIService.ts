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
  const url = `https://api-mad-api-${environment}.radix.equinor.com/api/v1/ServiceMessage/${serviceName}`;
  return fetch(url).then((r) => r.ok && r.json());
};
