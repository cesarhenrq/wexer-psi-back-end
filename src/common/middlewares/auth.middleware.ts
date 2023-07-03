import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

class AuthMiddleware {
  static async execute(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { authorization = null } = req.headers;

      if (!authorization) {
        return res
          .status(401)
          .json({ message: "Token not found!", data: null });
      }

      const [, token] = authorization.split(" ");

      try {
        const secretKey = process.env.SECRET_KEY as string;

        const user = JWT.verify(token, secretKey);

        req.user = user;
      } catch (err: any) {
        return res.status(401).json({ message: "Invalid token!", data: null });
      }

      next();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", data: null });
    }
  }
}

export default AuthMiddleware;
