import Occurrence from "./entities/occurrence.entity";

import OccurrenceRepository from "./repositories/occurrence.repository";

import OccurrenceService from "./services/occurrence.service";

import OccurrenceController from "./controllers/occurrence.controller";

import TimelineRepository from "../timelines/repositories/timeline.repository";
import FileRepository from "../files/repositories/file.repository";

export default class OccurrenceModule {
  static build(
    timelineRepository: TimelineRepository,
    fileRepository: FileRepository
  ) {
    const repository = new OccurrenceRepository(Occurrence);
    const service = new OccurrenceService(
      repository,
      timelineRepository,
      fileRepository
    );

    const controller = new OccurrenceController(service);

    return { repository, service, controller };
  }
}
