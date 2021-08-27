import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { validateJWTToken } from "../../utils/validateJWTToken";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  return new Promise<void>((resolve) => {
    try {
      if (req.method === "POST") {
        const token = req?.headers?.authorization?.split(" ")?.[1];
        if (!token) {
          res.status(401).json({ message: "Unauthorized: Missing JWT token" });
          return resolve();
        }
        return validateJWTToken(token)
          .then(() => {
            const { roomId } = req.body;
            res?.socket?.server?.io?.emit(`room-${roomId}`, req.body);
            res.status(201).json({ message: "Success!" });
          })
          .catch((err) => {
            res.status(403).json({ message: err });
          })
          .finally(() => resolve());
      } else {
        res.status(405).json({ message: "Method Not Allowed" });
        return resolve();
      }
    } catch (e) {
      console.error(e);
      res.status(500).end();
      return resolve();
    }
  });
};
