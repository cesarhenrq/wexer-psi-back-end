import Patient from "../entities/patient.entity";

import { CreatePatientDto } from "../dtos/create-patient.dto";
import { UpdatePatientDto } from "../dtos/update-patient.dto";

export default class PatientRepository {
  constructor(private model: typeof Patient) {}

  async create(patient: CreatePatientDto) {
    return await this.model.create(patient);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, patient: UpdatePatientDto) {
    return this.model.findByIdAndUpdate(id, patient, { new: true });
  }
}
