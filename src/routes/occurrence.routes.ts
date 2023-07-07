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

export default occurrenceRouter;
