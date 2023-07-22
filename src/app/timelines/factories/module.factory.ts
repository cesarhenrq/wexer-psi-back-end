import TimelineModule from "../timeline.module";
import FileModule from "../../files/file.module";

import PatientRepository from "../../patients/repositories/patient.repository";
import Patient from "../../patients/entities/patient.entity";

import OccurrenceRepository from "../../occurrences/repositories/occurrence.repository";
import Occurrence from "../../occurrences/entities/occurrence.entity";

export default class TimelineModuleFactory {
  static build() {
    const patientRepository = new PatientRepository(Patient);
    const occurrenceRepository = new OccurrenceRepository(Occurrence);
    const fileRepository = FileModule.build().repository;

    const timelineModule = TimelineModule.build(
      occurrenceRepository,
      patientRepository,
      fileRepository
    );

    return { ...timelineModule };
  }
}
