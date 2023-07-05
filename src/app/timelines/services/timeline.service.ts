import TimelineRepository from "../repositories/timeline.repository";
import PatientRepository from "../../patients/repositories/patient.repository";

import { CreateTimelineDto } from "../dtos/create-timeline.dto";

export default class TimelineService {
  constructor(
    private timelineRepository: TimelineRepository,
    private patientRepository: PatientRepository
  ) {}

  async create(patientId: string, payload: CreateTimelineDto) {
    try {
      const patient = await this.patientRepository.findById(patientId);

      if (!patient) {
        return {
          status: 404,
          message: "Patient not found",
          data: null,
        };
      }

      const timeline = await this.timelineRepository.create(payload);

      await this.patientRepository.associateTimeline(
        patientId,
        timeline._id as unknown as string
      );

      return {
        status: 201,
        message: "Timeline created",
        data: timeline,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async findById(id: string) {
    try {
      const timeline = await this.timelineRepository.findById(id);

      if (!timeline) {
        return {
          status: 404,
          message: "Timeline not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "Timeline found",
        data: timeline,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
}
