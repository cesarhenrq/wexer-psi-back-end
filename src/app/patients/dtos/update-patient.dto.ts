import { CreatePatientDto } from "./create-patient.dto";

export interface UpdatePatientDto
  extends Partial<Omit<CreatePatientDto, "user">> {}
