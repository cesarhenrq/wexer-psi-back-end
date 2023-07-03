import User from "../entities/user.entity";

export default class UserRepository {
  constructor(private model: typeof User) {}
}
