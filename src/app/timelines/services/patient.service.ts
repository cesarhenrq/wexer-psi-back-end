import TimelineRepository from "../repositories/timeline.repository";
import PatientRepository from "../../patients/repositories/patient.repository";

export default class TimelineService {
  constructor(
    private timelineRepository: TimelineRepository,
    private patientRepository: PatientRepository
  ) {}
}
