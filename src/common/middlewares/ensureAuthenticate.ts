import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

class EnsureAuthenticate {
  static async execute(req: Request, res: Response, next: NextFunction) {
    const { authorization = null } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: "Token not found" });
    }

    const [, token] = authorization.split(" ");

    try {
      JWT.verify(token, process.env.SECRET_KEY as string);
    } catch (err: any) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const data = JWT.decode(token) as { id: string };

    next();
  }
}

export default EnsureAuthenticate;
