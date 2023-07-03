import UserRepository from "../../users/repositories/user.repository";

export default class AuthService {
  constructor(private userRepository: UserRepository) {}
}
