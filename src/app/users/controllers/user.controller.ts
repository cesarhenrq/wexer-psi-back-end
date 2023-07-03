import { Request, Response } from "express";

import UserService from "../services/user.service";

import userSchema from "../schemas/user.schema";
import updateUserSchema from "../schemas/update-user.schema";

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

  async update(req: Request, res: Response) {
    const { body, file } = req;

    const { id } = req.params;

    try {
      await updateUserSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors,
        data: null,
      });
    }

    let payload = { ...body };

    if (file) {
      const { filename, mimetype } = file;
      payload = { ...payload, image: { filename, mimetype } };
    }

    const { status, message, data } = await this.service.update(id, payload);

    return res.status(status).json({
      message,
      data,
    });
  }
}
