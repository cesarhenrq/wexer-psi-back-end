import TimelineRepository from "../repositories/timeline.repository";
import PatientRepository from "../../patients/repositories/patient.repository";
import OccurrenceRepository from "../../occurrences/repositories/occurrence.repository";
import FileRepository from "../../files/repositories/file.repository";

import { CreateTimelineDto } from "../dtos/create-timeline.dto";
import { UpdateTimelineDto } from "../dtos/update-timeline.dto";

import paginate from "../../../utils/paginate";

export default class TimelineService {
  constructor(
    private timelineRepository: TimelineRepository,
    private patientRepository: PatientRepository,
    private occurrenceRepository: OccurrenceRepository,
    private fileRepository: FileRepository
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

  async update(id: string, payload: UpdateTimelineDto) {
    try {
      const timeline = await this.timelineRepository.update(id, payload);

      if (!timeline) {
        return {
          status: 404,
          message: "Timeline not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "Timeline updated",
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

  async findOccurrences(id: string, page: any, limit: any) {
    try {
      const timeline = await this.timelineRepository.findById(id);

      if (!timeline) {
        return {
          status: 404,
          message: "Timeline not found",
          data: null,
        };
      }

      await timeline.populate("occurrences");

      const occurrences = paginate(timeline.occurrences, page, limit);

      return {
        status: 200,
        message: "Occurrences found",
        data: occurrences,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async delete(id: string, patientId: string) {
    try {
      const patient = await this.patientRepository.findById(patientId);

      if (!patient) {
        return {
          status: 404,
          message: "Patient not found",
          data: null,
        };
      }

      const timeline = await this.timelineRepository.delete(id);

      if (!timeline) {
        return {
          status: 404,
          message: "Timeline not found",
          data: null,
        };
      }

      if (timeline.occurrences.length) {
        for (const occurrence of timeline.occurrences) {
          const deletedOccurrence = await this.occurrenceRepository.delete(
            occurrence._id as unknown as string
          );

          const hasFiles = deletedOccurrence && deletedOccurrence.files.length;

          if (hasFiles) {
            await this.fileRepository.deleteMany(
              deletedOccurrence.files as unknown as string[]
            );
          }
        }
      }

      await this.patientRepository.disassociateTimeline(
        patientId,
        timeline._id as unknown as string
      );

      return {
        status: 200,
        message: "Timeline deleted",
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
