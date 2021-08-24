import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";

export default (req: NextApiRequest, res: NextApiResponseServerIO): void => {
  if (req.method === "POST") {
    // get message
    const message = req.body;
    const { roomId } = message;

    // Todo: Verify jwt token before dispatching
    // dispatch to channel "room-id"
    // res?.socket?.server?.io?.emit(`room-${roomId}`, message);

    // return message
    res.status(201).json(message);
  }
};
