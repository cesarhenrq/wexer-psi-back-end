import { Router } from "express";

const authRouter = Router();

import AuthModule from "../app/auth/auth.module";

const authController = AuthModule.build().controller;

authRouter.post("/", authController.login.bind(authController));

export default authRouter;
