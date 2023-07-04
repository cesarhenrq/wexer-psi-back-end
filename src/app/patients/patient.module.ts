import Patient from "./entities/patient.entity";

import PatientRepository from "./repositories/patient.repository";

import PatientService from "./services/patient.service";

import PatientController from "./controllers/patient.controller";

import UserModule from "../users/user.module";

export default class PatientModule {
  static build() {
    const repository = new PatientRepository(Patient);
    const service = new PatientService(
      repository,
      UserModule.build().repository
    );
    const controller = new PatientController(service);

    return { controller, service, repository };
  }
}
