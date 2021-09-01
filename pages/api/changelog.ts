import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  return new Promise<void>((resolve) => {
    try {
      if (req.method === "GET") {
        fetch(
          `https://raw.githubusercontent.com/equinor/MAD-VSM-WEB/main/CHANGELOG.md`,
          { method: "GET" }
        ).then(async (r) =>
          res.status(r.status).json({ text: await r.text() })
        );
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
