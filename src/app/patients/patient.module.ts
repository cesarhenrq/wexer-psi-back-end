import Patient from "./entities/patient.entity";

import PatientRepository from "./repositories/patient.repository";

import PatientService from "./services/patient.service";

import PatientController from "./controllers/patient.controller";

import TimelineRepository from "../timelines/repositories/timeline.repository";
import UserRepository from "../users/repositories/user.repository";
import OccurrenceRepository from "../occurrences/repositories/occurrence.repository";
import FileRepository from "../files/repositories/file.repository";

export default class PatientModule {
  static build(
    timelineRepository: TimelineRepository,
    userRepository: UserRepository,
    occurrenceRepository: OccurrenceRepository,
    fileRepository: FileRepository
  ) {
    const repository = new PatientRepository(Patient);
    const service = new PatientService(
      repository,
      userRepository,
      timelineRepository,
      occurrenceRepository,
      fileRepository
    );
    const controller = new PatientController(service);

    return { controller, service, repository };
  }
}
