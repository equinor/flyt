import signalR, {
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import getConfig from "next/config";

export class SignalRService {
  constructor(
    projectId: number,
    changeHandlers: {
      onSaveProject;
      onDeleteProject;
      onUpdateObject;
      onDeleteObject;
      onSaveTask;
      onDeleteTask;
    }
  ) {
    const { publicRuntimeConfig } = getConfig();
    this._connection = new HubConnectionBuilder()
      .withUrl(`${publicRuntimeConfig.API_HUB_URL}`)
      .withAutomaticReconnect()
      .build();

    console.log("Starting connection");
    this._connection
      .start()
      .then(() =>
        this._connection
          .invoke("SubscribeToVsm", projectId)
          .then((r) => console.log("invocation response", r))
          .catch((e) => {
            console.error(e);
          })
      )
      .catch((err) => {
        console.error(err);
      });

    //todo: Make it work. It's not triggering on any updates...
    this._connection.on("SaveProject", (data) =>
      changeHandlers.onSaveProject(data)
    );
    this._connection.on("DeleteProject", (data) => {
      changeHandlers.onDeleteProject(data);
    });
    this._connection.on("UpdateObject", (data) => {
      changeHandlers.onUpdateObject(data);
    });
    this._connection.on("DeletedObject", (data) => {
      changeHandlers.onDeleteObject(data);
    });
    this._connection.on("SaveTask", (data) => {
      changeHandlers.onSaveTask(data);
    });
    this._connection.on("DeleteTask", (data) =>
      changeHandlers.onDeleteTask(data)
    );

    this._connection.onreconnecting((error) =>
      console.log("Trying to reconnect...", { error })
    );
    this._connection.onreconnected((s) => console.log("Reconnected!", s));
    this._connection.onclose((error) =>
      console.log("Connection closed.", { error })
    );
  }

  private _connection: signalR.HubConnection;

  get connection(): HubConnection {
    return this._connection;
  }

  disconnect = (): void => {
    if (this?._connection) {
      this._connection.stop().then((r) => console.log(r));
    }
  };
}
