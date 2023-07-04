import UserRepository from "../repositories/user.repository";
import FileRepository from "../../files/repositories/file.repository";

import { hash } from "bcryptjs";

import { CreateUserServiceDto } from "../dtos/create-user-service.dto";
import { UpdateUserServiceDto } from "../dtos/update-user-service.dto";

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

      let imageId = null;
      if (payload.image) {
        const image = await this.fileRepository.create(payload.image);
        imageId = image.id;
      }

      const userToCreate = {
        ...payload,
        image: imageId,
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

  async update(id: string, payload: UpdateUserServiceDto) {
    try {
      const { image, ...userToUpdate } = payload;

      if (image) {
        await this.fileRepository.update(image._id, image);
      }

      if (payload.password) {
        userToUpdate.password = await hash(payload.password, 10);
      }

      const user = await this.userRepository.update(id, userToUpdate);

      return {
        status: 200,
        message: "User updated successfully",
        data: user,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async delete(id: string) {
    try {
      const res = await this.userRepository.delete(id);

      if (res) await this.fileRepository.delete(res.image as unknown as string);

      if (!res) {
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      return {
        status: 200,
        message: "User deleted successfully",
        data: res,
      };
    } catch (err) {
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }
}
