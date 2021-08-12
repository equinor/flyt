import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req: NextApiRequest, res: NextApiResponseServerIO): void => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server;
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = new ServerIO(httpServer as unknown as NetServer, {
      path: "/api/socketio",
    });
  }
  res.end();
};
