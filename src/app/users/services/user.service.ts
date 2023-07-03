import UserRepository from "../repositories/user.repository";
import FileRepository from "../../files/repositories/file.repository";

import { hash } from "bcryptjs";

import { CreateUserServiceDto } from "../dtos/create-user-service.dto";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private fileRepository: FileRepository
  ) {}

  async create(payload: CreateUserServiceDto) {
    try {
      const user = await this.userRepository.findByEmail(payload.email);

      if (user) {
        return {
          message: "User already exists",
          status: 400,
          data: null,
        };
      }

      const image = await this.fileRepository.create(payload.image);

      const userToCreate = {
        ...payload,
        image: image.id,
        password: await hash(payload.password, 10),
      };

      const newUser = await this.userRepository.create(userToCreate);

      return {
        status: 201,
        message: "User created successfully",
        data: newUser,
      };
    } catch (err: any) {
      console.log(err);

      return {
        status: err.message ? 400 : 500,
        message: err.message || "Internal server error",
        data: null,
      };
    }
  }
}
