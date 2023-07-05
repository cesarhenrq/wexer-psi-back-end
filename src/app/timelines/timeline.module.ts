import Timeline from "./entities/timeline.entity";

import TimelineRepository from "./repositories/timeline.repository";

import TimelineService from "./services/timeline.service";

import TimelineController from "./controllers/timeline.controller";

import PatientModule from "../patients/patient.module";

export default class TimelineModule {
  static build() {
    const repository = new TimelineRepository(Timeline);
    const service = new TimelineService(
      repository,
      PatientModule.build().repository
    );
    const controller = new TimelineController(service);

    return { repository, service, controller };
  }
}
