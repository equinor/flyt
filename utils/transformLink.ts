export const transformLink = (url: string) => {
  const https = "https://";
  const httpProtocol = url.substring(0, 7);
  const httpsProtocol = url.substring(0, 8);
  const startsWithProtocol =
    httpProtocol === "http://" || httpsProtocol === https;

  return startsWithProtocol ? url : `${https}${url}`;
};
