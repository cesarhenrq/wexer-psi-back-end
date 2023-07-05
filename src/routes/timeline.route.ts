import { Router } from "express";

const timelineRouter = Router();

import AuthMiddleware from "../common/middlewares/auth.middleware";

import TimelineModule from "../app/timelines/timeline.module";

const timelineController = TimelineModule.build().controller;

timelineRouter.use(AuthMiddleware.execute.bind(AuthMiddleware));

timelineRouter.post("/:id", timelineController.create.bind(timelineController));

timelineRouter.get(
  "/:id",
  timelineController.findById.bind(timelineController)
);

export default timelineRouter;
