import OccurrenceModule from "../occurrence.module";

import TimelineRepository from "../../timelines/repositories/timeline.repository";
import Timeline from "../../timelines/entities/timeline.entity";

import FileModule from "../../files/file.module";

export default class OccurrenceModuleFactory {
  static build() {
    const timelineRepository = new TimelineRepository(Timeline);
    const fileRepository = FileModule.build().repository;

    const occurrenceModule = OccurrenceModule.build(
      timelineRepository,
      fileRepository
    );

    return { ...occurrenceModule };
  }
}
