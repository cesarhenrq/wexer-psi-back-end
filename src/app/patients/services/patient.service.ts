import UserRepository from "../../users/repositories/user.repository";
import PatientRepository from "../repositories/patient.repository";
import TimelineRepository from "../../timelines/repositories/timeline.repository";
import OccurrenceRepository from "../../occurrences/repositories/occurrence.repository";
import FileRepository from "../../files/repositories/file.repository";

import { CreatePatientDto } from "../dtos/create-patient.dto";
import { UpdatePatientDto } from "../dtos/update-patient.dto";

import paginate from "../../../utils/paginate";

export default class PatientService {
  constructor(
    private patientRepository: PatientRepository,
    private userRepository: UserRepository,
    private timelineRepository: TimelineRepository,
    private occurrenceRepository: OccurrenceRepository,
    private fileRepository: FileRepository
  ) {}

  async create(payload: CreatePatientDto) {
    try {
      const user = await this.userRepository.findById(payload.user);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      const patient = await this.patientRepository.create(payload);

      await this.userRepository.associatePatient(
        payload.user,
        patient._id as unknown as string
      );

      return {
        status: 201,
        message: "Patient created",
        data: patient,
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
      const patient = await this.patientRepository.findById(id);

      if (!patient) {
        return {
          status: 404,
          message: "Patient not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "Patient found",
        data: patient,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async update(id: string, payload: UpdatePatientDto) {
    try {
      const patient = await this.patientRepository.findById(id);

      if (!patient) {
        return {
          status: 404,
          message: "Patient not found",
          data: null,
        };
      }

      const updatedPatient = await this.patientRepository.update(id, payload);

      return {
        status: 200,
        message: "Patient updated",
        data: updatedPatient,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async findAllTimelines(id: string, page: any, limit: any) {
    try {
      const patient = await this.patientRepository.findById(id);

      if (!patient) {
        return {
          status: 404,
          message: "Patient not found",
          data: null,
        };
      }

      await patient.populate("timelines");

      const timelines = paginate(patient.timelines, page, limit);

      return {
        status: 200,
        message: "Patient timelines found",
        data: timelines,
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
      const patient = await this.patientRepository.delete(id);

      if (!patient) {
        return {
          status: 404,
          message: "Patient not found",
          data: null,
        };
      }

      await this.userRepository.disassociatePatient(
        patient.user as unknown as string,
        id
      );

      const hasTimelines = patient.timelines.length > 0;

      if (hasTimelines) {
        for (const timeline of patient.timelines) {
          const deletedTimeline = await this.timelineRepository.delete(
            timeline as unknown as string
          );

          if (deletedTimeline) {
            const hasOccurrences = deletedTimeline.occurrences.length > 0;

            if (hasOccurrences) {
              for (const occurrence of deletedTimeline.occurrences) {
                const deletedOccurrence =
                  await this.occurrenceRepository.delete(
                    occurrence as unknown as string
                  );

                if (deletedOccurrence) {
                  const hasFiles = deletedOccurrence.files.length > 0;

                  if (hasFiles) {
                    await this.fileRepository.deleteMany(
                      deletedOccurrence.files as any[]
                    );
                  }
                }
              }
            }
          }
        }
      }

      return {
        status: 200,
        message: "Patient deleted",
        data: patient,
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
