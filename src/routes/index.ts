import { Router } from "express";

import reqInfoMiddleware from "../common/middlewares/req-info.middleware";

import userRouter from "./user.routes";

const routes = Router();

routes.use(reqInfoMiddleware);

routes.use("/users", userRouter);

export default routes;
