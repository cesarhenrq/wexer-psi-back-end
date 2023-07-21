import Occurrence from "./entities/occurrence.entity";

import OccurrenceRepository from "./repositories/occurrence.repository";

import OccurrenceService from "./services/occurrence.service";

import OccurrenceController from "./controllers/occurrence.controller";

import FileModule from "../files/file.module";
import TimelineModule from "../timelines/timeline.module";

export default class OccurrenceModule {
  static build() {
    const repository = new OccurrenceRepository(Occurrence);
    const service = new OccurrenceService(
      repository,
      TimelineModule.build(repository).repository,
      FileModule.build().repository
    );

    const controller = new OccurrenceController(service);

    return { repository, service, controller };
  }
}
