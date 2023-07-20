import { Router } from "express";

const occurrenceRouter = Router();

import AuthMiddleware from "../common/middlewares/auth.middleware";
import upload from "../configs/storage-config";

import OccurrenceModule from "../app/occurrences/occurrence.module";

const occurrenceController = OccurrenceModule.build().controller;

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
