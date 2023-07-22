import { Router } from "express";

const occurrenceRouter = Router();

import AuthMiddleware from "../common/middlewares/auth.middleware";
import upload from "../configs/storage-config";

import OccurrenceModuleFactory from "../app/occurrences/factories/module.factory";

const occurrenceController = OccurrenceModuleFactory.build().controller;

occurrenceRouter.use(AuthMiddleware.execute.bind(AuthMiddleware));

occurrenceRouter.post(
  "/:id",
  upload.array("files"),
  occurrenceController.create.bind(occurrenceController)
);

occurrenceRouter.get(
  "/:id",
  occurrenceController.findById.bind(occurrenceController)
);

occurrenceRouter.patch(
  "/:id",
  upload.array("files"),
  occurrenceController.update.bind(occurrenceController)
);

occurrenceRouter.delete(
  "/:id/timelines/:timelineId",
  occurrenceController.delete.bind(occurrenceController)
);

export default occurrenceRouter;
