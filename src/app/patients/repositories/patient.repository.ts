import Patient from "../entities/patient.entity";

export default class PatientRepository {
  constructor(private model: typeof Patient) {}
}
