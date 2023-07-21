import Timeline from "./entities/timeline.entity";

import TimelineRepository from "./repositories/timeline.repository";

import TimelineService from "./services/timeline.service";

import TimelineController from "./controllers/timeline.controller";

import PatientModule from "../patients/patient.module";
import FileModule from "../files/file.module";

import OccurrenceRepository from "../occurrences/repositories/occurrence.repository";

export default class TimelineModule {
  static build(occurrenceRepository: OccurrenceRepository) {
    const repository = new TimelineRepository(Timeline);
    const service: any = new TimelineService(
      repository,
      PatientModule.build().repository,
      occurrenceRepository,
      FileModule.build().repository
    );
    const controller = new TimelineController(service);

    return { repository, service, controller };
  }
}
