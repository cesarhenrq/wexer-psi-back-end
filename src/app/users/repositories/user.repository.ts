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
}
