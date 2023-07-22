import UserModule from "../user.module";
import FileModule from "../../files/file.module";

import PatientRepository from "../../patients/repositories/patient.repository";
import Patient from "../../patients/entities/patient.entity";

import TimelineRepository from "../../timelines/repositories/timeline.repository";
import Timeline from "../../timelines/entities/timeline.entity";

import OccurrenceRepository from "../../occurrences/repositories/occurrence.repository";
import Occurrence from "../../occurrences/entities/occurrence.entity";

export default class UserModuleFactory {
  static build() {
    const patientRepository = new PatientRepository(Patient);
    const timelineRepository = new TimelineRepository(Timeline);
    const occurrenceRepository = new OccurrenceRepository(Occurrence);
    const fileRepository = FileModule.build().repository;

    const userModule = UserModule.build(
      patientRepository,
      timelineRepository,
      occurrenceRepository,
      fileRepository
    );

    return { ...userModule };
  }
}
