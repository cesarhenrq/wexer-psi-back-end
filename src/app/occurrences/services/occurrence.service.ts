import OccurrenceRepository from "../repositories/occurrence.repository";
import TimelineRepository from "../../timelines/repositories/timeline.repository";
import FileRepository from "../../files/repositories/file.repository";

import { CreateOccurrenceServiceDto } from "../dtos/create-occurrence-service.dto";
import { CreateOccurrenceDto } from "../dtos/create-occurrence.dto";
import { UpdateOccurrenceServiceDto } from "../dtos/update-occurrence-service.dto";
import { CreateFileDto } from "../../files/dtos/create-file.dto";
import { UpdateOccurrenceDto } from "../dtos/update-occurrences.dto";

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
        (payload.files as any) = files.map(
          (file) => file._id as unknown as string
        );
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

  async update(id: string, payload: UpdateOccurrenceServiceDto) {
    try {
      const occurrence = await this.occurrenceRepository.findById(id);

      if (!occurrence) {
        return {
          status: 404,
          message: "Occurrence not found",
          data: null,
        };
      }

      if (payload.files && !occurrence.files.length) {
        const files = await this.fileRepository.createMany(payload.files);

        (payload.files as any) = files.map((file) => file._id);
      } else if (payload.files) {
        const filesToCreate = payload.files.filter((file) => {
          return !occurrence.files.some((occurrenceFile) => {
            return (
              (occurrenceFile as unknown as CreateFileDto).filename ===
              file.filename
            );
          });
        }) as CreateFileDto[];

        const filesToDelete = (
          occurrence.files as unknown as CreateFileDto[]
        ).filter((file) => {
          return (
            payload.files &&
            !payload.files.some((payloadFile) => {
              return (
                (payloadFile as unknown as CreateFileDto).filename ===
                file.filename
              );
            })
          );
        });

        const idsToDelete = filesToDelete.map((file: any) => file._id);

        const files = await this.fileRepository.createMany(filesToCreate);

        await this.fileRepository.deleteMany(idsToDelete as string[]);

        const filesToMaintain = occurrence.files.filter((_id) => {
          return !idsToDelete.includes(_id);
        });

        (payload.files as any) = filesToMaintain.concat(
          files.map((file) => file._id)
        );
      }

      const updatedOccurrence = await this.occurrenceRepository.update(
        id,
        payload as UpdateOccurrenceDto
      );

      if (updatedOccurrence) {
        await updatedOccurrence.populate("files");
      }

      return {
        status: 200,
        message: "Occurrence updated successfully",
        data: updatedOccurrence,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async delete(id: string) {
    try {
      const occurrence = await this.occurrenceRepository.delete(id);

      if (!occurrence) {
        return {
          status: 404,
          message: "Occurrence not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "Occurrence deleted successfully",
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
