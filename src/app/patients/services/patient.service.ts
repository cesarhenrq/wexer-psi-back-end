import UserRepository from "../../users/repositories/user.repository";
import PatientRepository from "../repositories/patient.repository";

import { CreatePatientDto } from "../dtos/create-patient.dto";

export default class PatientService {
  constructor(
    private patientRepository: PatientRepository,
    private userRepository: UserRepository
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
}
