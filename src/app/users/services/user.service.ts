import UserRepository from "../repositories/user.repository";
import FileRepository from "../../files/repositories/file.repository";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private fileRepository: FileRepository
  ) {}
}
