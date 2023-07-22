import User from "./entities/user.entity";

import UserRepository from "./repositories/user.repository";

import UserService from "./services/user.service";

import UserController from "./controllers/user.controller";

import PatientRepository from "../patients/repositories/patient.repository";
import TimelineRepository from "../timelines/repositories/timeline.repository";
import OccurrenceRepository from "../occurrences/repositories/occurrence.repository";
import FileRepository from "../files/repositories/file.repository";

export default class UserModule {
  static build(
    patientRepository: PatientRepository,
    timelineRepository: TimelineRepository,
    occurrenceRepository: OccurrenceRepository,
    fileRepository: FileRepository
  ) {
    const repository = new UserRepository(User);
    const service = new UserService(
      repository,
      patientRepository,
      timelineRepository,
      occurrenceRepository,
      fileRepository
    );
    const controller = new UserController(service);

    return { controller, service, repository };
  }
}
