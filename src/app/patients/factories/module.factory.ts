import PatientModule from "../patient.module";
import FileModule from "../../files/file.module";

import TimelineRepository from "../../timelines/repositories/timeline.repository";
import Timeline from "../../timelines/entities/timeline.entity";

import OccurrenceRepository from "../../occurrences/repositories/occurrence.repository";
import Occurrence from "../../occurrences/entities/occurrence.entity";

import UserRepository from "../../users/repositories/user.repository";
import User from "../../users/entities/user.entity";

export default class PatientModuleFactory {
  static build() {
    const timelineRepository = new TimelineRepository(Timeline);
    const occurrenceRepository = new OccurrenceRepository(Occurrence);
    const userRepository = new UserRepository(User);
    const fileRepository = FileModule.build().repository;

    const patientModule = PatientModule.build(
      timelineRepository,
      userRepository,
      occurrenceRepository,
      fileRepository
    );

    return { ...patientModule };
  }
}
