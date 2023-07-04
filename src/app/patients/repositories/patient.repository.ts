import Patient from "../entities/patient.entity";

import { CreatePatientDto } from "../dtos/create-patient.dto";

export default class PatientRepository {
  constructor(private model: typeof Patient) {}

  async create(patient: CreatePatientDto) {
    return await this.model.create(patient);
  }
}
