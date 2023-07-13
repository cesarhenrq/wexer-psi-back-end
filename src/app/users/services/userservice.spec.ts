import UserService from "./user.service";

import { CreateUserDto } from "../dtos/create-user.dto";
import { CreateUserServiceDto } from "../dtos/create-user-service.dto";
import { UpdateUserServiceDto } from "../dtos/update-user-service.dto";

import bcryptjs from "bcryptjs";
import paginate from "../../../utils/paginate";

jest.mock("bcryptjs");
jest.mock("../../../utils/paginate");

describe("User service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const bcryptjsHashSpy = jest.spyOn(bcryptjs, "hash");

  const mockedUserRepository = {
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  } as any;

  const mockedFileRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any;

  const sut = new UserService(mockedUserRepository, mockedFileRepository);

  describe("Create user", () => {
    const payload: CreateUserServiceDto = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
      image: {
        filename: "image.jpg",
        mimetype: "image/jpeg",
      },
    };

    const userToCreate: CreateUserDto = {
      ...payload,
      image: "1",
      password: "hashedPassword",
    };

    it("Should create an user", async () => {
      await mockedUserRepository.findByEmail.mockResolvedValue(null);

      await mockedFileRepository.create.mockResolvedValue({ id: "1" } as never);

      bcryptjsHashSpy.mockResolvedValue("hashedPassword" as never);

      mockedUserRepository.create.mockResolvedValue(userToCreate as never);

      const expected = {
        status: 201,
        message: "User created successfully",
        data: userToCreate,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        payload.email
      );
      expect(mockedFileRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.create).toHaveBeenCalledWith(payload.image);
      expect(bcryptjsHashSpy).toHaveBeenCalledTimes(1);
      expect(bcryptjsHashSpy).toHaveBeenCalledWith(payload.password, 10);
      expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.create).toHaveBeenCalledWith(userToCreate);
    });

    it("Should return an error if the email is already in use", async () => {
      await mockedUserRepository.findByEmail.mockResolvedValue(payload);

      const expected = {
        status: 400,
        message: "User already exists",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        payload.email
      );
    });

    it("Should return an error if something goes wrong in user repository", async () => {
      await mockedUserRepository.findByEmail.mockResolvedValue(null);

      await mockedFileRepository.create.mockResolvedValue({ id: "1" } as never);

      bcryptjsHashSpy.mockResolvedValue("hashedPassword" as never);

      mockedUserRepository.create.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        payload.email
      );
      expect(mockedFileRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.create).toHaveBeenCalledWith(payload.image);
      expect(bcryptjsHashSpy).toHaveBeenCalledTimes(1);
      expect(bcryptjsHashSpy).toHaveBeenCalledWith(payload.password, 10);
      expect(mockedUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.create).toHaveBeenCalledWith(userToCreate);
    });

    it("Should return an error if something goes wrong in file repository", async () => {
      await mockedUserRepository.findByEmail.mockResolvedValue(null);

      await mockedFileRepository.create.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
        payload.email
      );
      expect(mockedFileRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.create).toHaveBeenCalledWith(payload.image);
    });
  });

  describe("Update user", () => {
    const payload: UpdateUserServiceDto = {
      name: "John Doe",
      image: {
        filename: "image.jpg",
        mimetype: "image/jpg",
      },
      password: "123456",
    };

    const userUpdated = {
      name: "John Doe",
      image: "image-id",
      password: "hashed-password",
    };

    it("Should be able to update an user and create an image if user doesn't have one", async () => {
      await mockedUserRepository.findById.mockResolvedValue({
        name: "John",
      });

      await mockedFileRepository.create.mockResolvedValue({ id: "image-id" });

      bcryptjsHashSpy.mockResolvedValue("hashed-password" as never);

      await mockedUserRepository.update.mockResolvedValue(userUpdated);

      const expected = {
        status: 200,
        message: "User updated successfully",
        data: userUpdated,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockedFileRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.create).toHaveBeenCalledWith(payload.image);
      expect(bcryptjsHashSpy).toHaveBeenCalledTimes(1);
      expect(bcryptjsHashSpy).toHaveBeenCalledWith(payload.password, 10);
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        "user-id",
        userUpdated
      );
    });

    it("Should be able to update an user and update an image if user already have one", async () => {
      await mockedUserRepository.findById.mockResolvedValue({
        name: "John",
        image: {
          _id: "image-id",
          filename: "image.jpg",
          mimetype: "image/jpg",
        },
      });

      bcryptjsHashSpy.mockResolvedValue("hashed-password" as never);

      await mockedUserRepository.update.mockResolvedValue(userUpdated);

      const expected = {
        status: 200,
        message: "User updated successfully",
        data: userUpdated,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
      expect(bcryptjsHashSpy).toHaveBeenCalledTimes(1);
      expect(bcryptjsHashSpy).toHaveBeenCalledWith(payload.password, 10);
      expect(mockedFileRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.update).toHaveBeenCalledWith(
        "image-id",
        payload.image
      );
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith("user-id", {
        name: "John Doe",
        password: "hashed-password",
      });
    });

    it("Should return an error if user doesn't exists", async () => {
      await mockedUserRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "User not found",
        data: null,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
    });

    it("Should return an error if something goes wrong in user repository during find user", async () => {
      await mockedUserRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
    });

    it("Should return an error if something goes wrong in file repository during create image", async () => {
      await mockedUserRepository.findById.mockResolvedValue({
        name: "John",
      });

      await mockedFileRepository.create.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockedFileRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.create).toHaveBeenCalledWith(payload.image);
    });

    it("Should return an error if something goes wrong in file repository during update image", async () => {
      await mockedUserRepository.findById.mockResolvedValue({
        name: "John",
        image: {
          _id: "image-id",
          filename: "image.jpg",
          mimetype: "image/jpg",
        },
      });

      await mockedFileRepository.update.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockedFileRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.update).toHaveBeenCalledWith(
        "image-id",
        payload.image
      );
    });

    it("Should return an error if something goes wrong in user repository during update user", async () => {
      await mockedUserRepository.findById.mockResolvedValue({
        name: "John",
      });

      await mockedFileRepository.create.mockResolvedValue({ id: "image-id" });

      bcryptjsHashSpy.mockResolvedValue("hashed-password" as never);

      await mockedUserRepository.update.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("user-id", payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockedFileRepository.create).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.create).toHaveBeenCalledWith(payload.image);
      expect(bcryptjsHashSpy).toHaveBeenCalledTimes(1);
      expect(bcryptjsHashSpy).toHaveBeenCalledWith(payload.password, 10);
      expect(mockedUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.update).toHaveBeenCalledWith(
        "user-id",
        userUpdated
      );
    });
  });

  describe("Delete user", () => {
    const userDeleted = {
      name: "John Doe",
      image: "image-id",
    };

    it("Should delete an user", async () => {
      mockedUserRepository.delete.mockResolvedValue(userDeleted);

      const expected = {
        status: 200,
        message: "User deleted successfully",
        data: userDeleted,
      };

      const result = await sut.delete("user-id");

      expect(result).toEqual(expected);
      expect(mockedUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.delete).toHaveBeenCalledWith("user-id");
      expect(mockedFileRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.delete).toHaveBeenCalledWith("image-id");
    });

    it("Should return an error if user doesn't exists", async () => {
      await mockedUserRepository.delete.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "User not found",
        data: null,
      };

      const result = await sut.delete("user-id");

      expect(result).toEqual(expected);
      expect(mockedUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.delete).toHaveBeenCalledWith("user-id");
    });

    it("Should return an error if something goes wrong in user repository during delete user", async () => {
      await mockedUserRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete("user-id");

      expect(result).toEqual(expected);
      expect(mockedUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.delete).toHaveBeenCalledWith("user-id");
    });

    it("Should return an error if something goes wrong in file repository during delete image", async () => {
      mockedUserRepository.delete.mockResolvedValue(userDeleted);

      await mockedFileRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete("user-id");

      expect(result).toEqual(expected);
      expect(mockedUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.delete).toHaveBeenCalledWith("user-id");
      expect(mockedFileRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.delete).toHaveBeenCalledWith("image-id");
    });
  });

  describe("Find all patients", () => {
    const user = {
      name: "John Doe",
      patients: Array(20).fill("test"),
    };

    it("Should return all patients for a user", async () => {
      mockedUserRepository.findById.mockResolvedValue(user);

      const paginationModule = { paginate };

      const spyPaginate = jest.spyOn(paginationModule, "paginate" as never);

      spyPaginate.mockReturnValue(Array(10).fill("test") as never);

      const expected = {
        status: 200,
        message: "Patients retrieved successfully",
        data: Array(10).fill("test"),
      };

      const result = await sut.findAllPatients("user-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
      expect(spyPaginate).toHaveBeenCalledTimes(1);
      expect(spyPaginate).toHaveBeenCalledWith(user.patients, 1, 10);
    });

    it("Should return an error if user doesn't exists", async () => {
      mockedUserRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "User not found",
        data: null,
      };

      const result = await sut.findAllPatients("user-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
    });

    it("Should return an error if something goes wrong in user repository during find all patients", async () => {
      mockedUserRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.findAllPatients("user-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith("user-id");
    });
  });
});
