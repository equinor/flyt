import signalR, {
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import getConfig from "next/config";

export class SignalRService {
  private readonly _connection: signalR.HubConnection;

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
          .then((r) => {
            console.log("invocation response", r);
          })
          .catch((e) => {
            console.error(e);
          })
      )
      .catch((err) => {
        console.error(err);
      });

    //todo: Make it work. It's not triggering on any updates...
    this.connection.on("SaveProject", (data) => {
      changeHandlers.onSaveProject(data);
    });

    this.connection.on("DeleteProject", (data) => {
      changeHandlers.onDeleteProject(data);
    });

    this.connection.on("UpdateObject", (data) => {
      changeHandlers.onUpdateObject(data);
    });

    this.connection.on("DeletedObject", (data) => {
      changeHandlers.onDeleteObject(data);
    });

    this.connection.on("SaveTask", (data) => {
      changeHandlers.onSaveTask(data);
    });

    this.connection.on("DeleteTask", (data) => {
      changeHandlers.onDeleteTask(data);
    });

    this.connection.onreconnecting((error) => {
      console.log("SignalR | Trying to reconnect...", { error });
    });

    this.connection.onreconnected((s) => {
      console.log("SignalR | Reconnected!", s);
    });

    this.connection.onclose((error) => {
      console.log("SignalR | Connection closed.", { error });
    });
  }

  get connection(): HubConnection {
    return this._connection;
  }

  disconnect = (): void => {
    if (this?._connection) {
      this._connection.stop().then((r) => console.log(r));
    }
  };
}
