import Timeline from "./entities/timeline.entity";

import TimelineRepository from "./repositories/timeline.repository";

import TimelineService from "./services/timeline.service";

import TimelineController from "./controllers/timeline.controller";

import OccurrenceRepository from "../occurrences/repositories/occurrence.repository";
import PatientRepository from "../patients/repositories/patient.repository";
import FileRepository from "../files/repositories/file.repository";

export default class TimelineModule {
  static build(
    occurrenceRepository: OccurrenceRepository,
    patientRepository: PatientRepository,
    fileRepository: FileRepository
  ) {
    const repository = new TimelineRepository(Timeline);
    const service: any = new TimelineService(
      repository,
      patientRepository,
      occurrenceRepository,
      fileRepository
    );
    const controller = new TimelineController(service);

    return { repository, service, controller };
  }
}
