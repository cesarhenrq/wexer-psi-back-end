import UserRepository from "../repositories/user.repository";
import FileRepository from "../../files/repositories/file.repository";

import { hash } from "bcryptjs";

import { CreateUserServiceDto } from "../dtos/create-user-service.dto";
import { UpdateUserServiceDto } from "../dtos/update-user-service.dto";

import paginate from "../../../utils/paginate";

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
      return {
        status: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  async update(id: string, payload: UpdateUserServiceDto) {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      let { image, ...userToUpdate } = payload;

      if (image) {
        if (!user.image) {
          const res = await this.fileRepository.create({
            filename: image.filename,
            mimetype: image.mimetype,
          });

          userToUpdate = { ...userToUpdate, image: res.id } as any;
        } else {
          await this.fileRepository.update(
            user.image._id as unknown as string,
            image
          );
        }
      }

      if (payload.password) {
        userToUpdate.password = await hash(payload.password, 10);
      }

      const userUpdated = await this.userRepository.update(id, userToUpdate);

      return {
        status: 200,
        message: "User updated successfully",
        data: userUpdated,
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

      if (!res) {
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      await this.fileRepository.delete(res.image as unknown as string);

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

  async findAllPatients(id: string, page: any, limit: any) {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
          data: null,
        };
      }

      const patients = paginate(user.patients, page, limit);

      return {
        status: 200,
        message: "Patients retrieved successfully",
        data: patients,
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
