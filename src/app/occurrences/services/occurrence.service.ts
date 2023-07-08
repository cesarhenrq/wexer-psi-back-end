import OccurrenceRepository from "../repositories/occurrence.repository";
import TimelineRepository from "../../timelines/repositories/timeline.repository";
import FileRepository from "../../files/repositories/file.repository";

import { CreateOccurrenceServiceDto } from "../dtos/create-occurrence-service.dto";
import { CreateOccurrenceDto } from "../dtos/create-occurrence.dto";

export default class OccurrenceService {
  constructor(
    private occurrenceRepository: OccurrenceRepository,
    private timelineRepository: TimelineRepository,
    private fileRepository: FileRepository
  ) {}

  async create(timelineId: string, payload: CreateOccurrenceServiceDto) {
    try {
      const timeline = await this.timelineRepository.findById(timelineId);

      if (!timeline) {
        return {
          status: 404,
          message: "Timeline not found",
          data: null,
        };
      }

      if (payload.files) {
        const files = await this.fileRepository.createMany(payload.files);
        payload.files = files.map((file) => file.id);
      }

      const occurrence = await this.occurrenceRepository.create(
        payload as CreateOccurrenceDto
      );

      await this.timelineRepository.associateOccurrence(
        timelineId,
        occurrence.id
      );

      return {
        status: 201,
        message: "Occurrence created successfully",
        data: occurrence,
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
      const occurrence = await this.occurrenceRepository.findById(id);

      if (!occurrence) {
        return {
          status: 404,
          message: "Occurrence not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "Occurrence found",
        data: occurrence,
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
