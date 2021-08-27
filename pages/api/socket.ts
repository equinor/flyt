import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { validateJWTToken } from "../../utils/validateJWTToken";

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });

    // Authentication middleware
    io.use((socket, next) => {
      // JWT token from the user
      const jwtToken = socket?.handshake?.auth?.token?.split(" ")?.[1]; //Remove the "Bearer" part
      validateJWTToken(jwtToken)
        .then(() => next())
        .catch((err) => next(new Error(err)));
    });

    io.on("connection", (socket) => {
      // Broadcast all incoming requests to the other clients
      socket.onAny((eventName, ...args) => {
        socket.broadcast.emit(eventName, ...args);
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default server;
