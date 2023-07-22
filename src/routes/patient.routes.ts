import { Router } from "express";

const patientRouter = Router();

import AuthMiddleware from "../common/middlewares/auth.middleware";

import PatientModuleFactory from "../app/patients/factories/module.factory";

const patientController = PatientModuleFactory.build().controller;

patientRouter.use(AuthMiddleware.execute.bind(AuthMiddleware));

patientRouter.post("/", patientController.create.bind(patientController));

patientRouter.get("/:id", patientController.findById.bind(patientController));

patientRouter.patch("/:id", patientController.update.bind(patientController));

patientRouter.get(
  "/:id/timelines",
  patientController.findAllTimelines.bind(patientController)
);

patientRouter.delete("/:id", patientController.delete.bind(patientController));

export default patientRouter;
