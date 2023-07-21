import { Router } from "express";

const timelineRouter = Router();

import AuthMiddleware from "../common/middlewares/auth.middleware";

import TimelineModule from "../app/timelines/timeline.module";
import OccurrenceModule from "../app/occurrences/occurrence.module";

const occurrenceRepository = OccurrenceModule.build().repository;

const timelineController =
  TimelineModule.build(occurrenceRepository).controller;

timelineRouter.use(AuthMiddleware.execute.bind(AuthMiddleware));

timelineRouter.post("/:id", timelineController.create.bind(timelineController));

timelineRouter.get(
  "/:id",
  timelineController.findById.bind(timelineController)
);

timelineRouter.patch(
  "/:id",
  timelineController.update.bind(timelineController)
);

timelineRouter.get(
  "/:id/occurrences",
  timelineController.findOccurrences.bind(timelineController)
);

timelineRouter.delete(
  "/:id/patients/:patientId",
  timelineController.delete.bind(timelineController)
);

export default timelineRouter;
