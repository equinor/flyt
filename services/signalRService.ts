import signalR, { HubConnectionBuilder } from "@microsoft/signalr";
import getConfig from "next/config";

export class SignalRService {
  connection: signalR.HubConnection;

  constructor() {
    const { publicRuntimeConfig } = getConfig();
    this.connection = new HubConnectionBuilder()
      .withUrl(`${publicRuntimeConfig.API_HUB_URL}`)
      .withAutomaticReconnect()
      .build();

    this.connection.start().then(() => {
      console.log({ connection: this.connection });
    });
    //todo: Make it work. It's not triggerig on any updates
    this.connection.on("SaveProject", (data) => {
      console.log("SaveProject", data);
    });
    this.connection.on("DeleteProject", (data) => {
      console.log("DeletesProject", data);
    });
    this.connection.on("UpdateObject", (data) => {
      console.log("UpdateObject", data);
    });
    this.connection.on("DeletedObject", (data) => {
      console.log("DeletedObject", data);
    });
    this.connection.on("SaveTask", (data) => {
      console.log("SaveTask", data);
    });
    this.connection.on("DeleteTask", (data) => {
      console.log("DeleteTask", data);
    });
  }
}
