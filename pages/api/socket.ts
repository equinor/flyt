import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { authorize } from "@thream/socketio-jwt";
import getConfig from "next/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const { serverRuntimeConfig } = getConfig();

  // Todo: Auth
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });
    io.use(
      authorize({ secret: serverRuntimeConfig.AUTH_SECRET }) // "your secret or public key",
    );
    io.on("connection", async (socket) => {
      // jwt payload of the connected client
      console.log("socket.decodedToken", socket.decodedToken);
      // Broadcast all incoming requests to the other clients
      socket.onAny((eventName, ...args) => {
        console.log(eventName);
        socket.broadcast.emit(eventName, ...args);
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default server;
