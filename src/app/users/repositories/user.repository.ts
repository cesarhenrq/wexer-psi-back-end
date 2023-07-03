import User from "../entities/user.entity";

export default class UserRepository {
  constructor(private model: typeof User) {}

  async findByEmail(email: string) {
    return this.model.findOne({ email }).populate("image");
  }
}
