import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // Broadcast all incoming requests to the other clients
      socket.onAny((eventName, ...args) =>
        socket.broadcast.emit(eventName, ...args)
      );
    });
  }
  res.end();
};

export default server;
