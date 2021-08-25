import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import getConfig from "next/config";
import jwt from "jsonwebtoken";
import { ExtendedError } from "socket.io/dist/namespace";

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const { serverRuntimeConfig } = getConfig();

  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    });

    // JWT validation
    // Get keys from microsoft to use in validating
    const request = await fetch(
      "https://login.microsoftonline.com/common/discovery/keys"
    );
    const data = await request.json();
    const possibleKeys = data.keys.map((key) => ({
      x5c: key.x5c,
      x5t: key.x5t,
    }));

    // Authentication middleware
    io.use((socket, next) => {
      // JWT token from the user
      const jwtToken = socket?.handshake?.auth?.token?.split(" ")?.[1]; //Remove the "Bearer" part
      if (jwtToken) {
        const jwtTokenHeader = JSON.parse(atob(jwtToken.split(".")[0]));
        // Cross-Reference Azure AD-Issued Token to get the Correct Public Key
        const matchingKey = possibleKeys.find(
          (key) => key.x5t === jwtTokenHeader.x5t
        );
        if (matchingKey) {
          const token = jwtToken;
          const publicKey =
            "-----BEGIN CERTIFICATE-----\n" +
            matchingKey.x5c +
            "\n-----END CERTIFICATE-----";
          const verifyOptions = {
            algorithms: ["RS256"],
            audience: serverRuntimeConfig.AUDIENCE,
            issuer:
              "https://sts.windows.net/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/",
          };
          jwt.verify(token, publicKey, verifyOptions, (err: ExtendedError) => {
            if (err) {
              // Is it a problem to return the actual error?
              return next(new Error(err.message));
            } else {
              //Success!
              return next();
            }
          });
        } else {
          return next(
            new Error("Authentication error: Bad token. Does not match key")
          );
        }
      } else {
        return next(new Error("Authentication error: Missing token"));
      }
    });

    io.on("connection", async (socket) => {
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
