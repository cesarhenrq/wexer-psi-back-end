import { Request, Response } from "express";

import UserService from "../services/user.service";

import userSchema from "../schemas/user.schema";

export default class UserController {
  constructor(private service: UserService) {}

  async create(req: Request, res: Response) {
    const { body, file } = req;

    if (!file) {
      return res.status(400).json({
        message: "Image is required",
        data: null,
      });
    }

    const { filename, mimetype } = file;

    try {
      await userSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors,
        data: null,
      });
    }

    const payload = { ...body, image: { filename, mimetype } };

    const { status, message, data } = await this.service.create(payload);

    return res.status(status).json({
      message,
      data,
    });
  }
}
