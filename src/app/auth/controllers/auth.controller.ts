import AuthService from "../services/auth.service";

import { Request, Response } from "express";

import loginSchema from "../schemas/login.schema";

export default class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const { body: payload } = req;

    try {
      await loginSchema.validate(payload);
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors,
        data: null,
      });
    }

    const { status, data, message } = await this.authService.login(payload);

    return res.status(status).json({
      message,
      data,
    });
  }
}
