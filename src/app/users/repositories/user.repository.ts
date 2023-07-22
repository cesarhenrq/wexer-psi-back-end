import User from "../entities/user.entity";

import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export default class UserRepository {
  constructor(private model: typeof User) {}

  async create(user: CreateUserDto) {
    return this.model.create(user);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).populate("image");
  }

  async update(id: string, user: UpdateUserDto) {
    return this.model.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async findById(id: string) {
    return this.model.findById(id).populate("image").populate("patients");
  }

  async associatePatient(id: string, patientId: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $push: { patients: patientId },
      },
      { new: true }
    );
  }

  async disassociatePatient(id: string, patientId: string) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { patients: patientId } },
      { new: true }
    );
  }
}
