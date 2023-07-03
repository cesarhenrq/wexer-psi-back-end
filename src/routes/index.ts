import { Router } from "express";

import reqInfoMiddleware from "../common/middlewares/req-info.middleware";

import userRouter from "./user.routes";
import authRouter from "./auth.routes";

const routes = Router();

routes.use(reqInfoMiddleware);

routes.use("/users", userRouter);

routes.use("/auth", authRouter);

export default routes;
