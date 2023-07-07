import { Router } from "express";

import reqInfoMiddleware from "../common/middlewares/req-info.middleware";

import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import patientRouter from "./patient.routes";
import timelineRouter from "./timeline.route";
import occurrenceRouter from "./occurrence.routes";

const routes = Router();

routes.use(reqInfoMiddleware);

routes.use("/users", userRouter);

routes.use("/auth", authRouter);

routes.use("/patients", patientRouter);

routes.use("/timelines", timelineRouter);

routes.use("/occurrences", occurrenceRouter);

export default routes;
