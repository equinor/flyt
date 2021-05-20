import * as signalR from "@microsoft/signalr";

/**
 * setUpSignalRConnection
 * @param projectId
 */
export const setUpSignalRConnection = async (projectId: number) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://vsm-api-dev.azurewebsites.net/vsmhub")
    // .withUrl(Endpoint, { accessTokenFactory: () => getAccessToken() })
    .withAutomaticReconnect()
    .build();

  connection
    .start()
    .then(() => connection.invoke("SubscribeToVsm", projectId))
    .catch((err) => console.error(err));

  return connection;
};
