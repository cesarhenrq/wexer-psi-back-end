import UserRepository from "../../users/repositories/user.repository";
import PatientRepository from "../repositories/patient.repository";

export default class PatientService {
  constructor(
    private patientRepository: PatientRepository,
    private userRepository: UserRepository
  ) {}
}
