import { Router } from "express";

const patientRouter = Router();

import AuthMiddleware from "../common/middlewares/auth.middleware";

import PatientModule from "../app/patients/patient.module";

const patientController = PatientModule.build().controller;

patientRouter.use(AuthMiddleware.execute.bind(AuthMiddleware));

patientRouter.post("/", patientController.create.bind(patientController));

patientRouter.get("/:id", patientController.findById.bind(patientController));

patientRouter.patch("/:id", patientController.update.bind(patientController));

export default patientRouter;
