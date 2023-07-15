import UserController from "./user.controller";

import { mockRequest, mockResponse } from "jest-mock-req-res";

import userSchema from "../schemas/user.schema";
import updateUserSchema from "../schemas/update-user.schema";

jest.mock("../schemas/user.schema");
jest.mock("../schemas/update-user.schema");

describe("UserController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedUserService: any = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAllPatients: jest.fn(),
  };

  const sut = new UserController(mockedUserService);

  describe("Create", () => {
    it("Should return 201 when user is created", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
        file: {
          filename: "any_filename",
          mimetype: "any_mimetype",
        },
      });

      const userToCreate = {
        ...user,
        image: {
          filename: "any_filename",
          mimetype: "any_mimetype",
        },
      };

      const userCreated = {
        ...user,
        id: "any_id",
        patients: [],
        image: "any_image",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      const mockedResponse = mockResponse();

      mockedUserService.create.mockResolvedValue({
        status: 201,
        message: "User created!",
        data: userCreated,
      });

      userSchema.validate = jest.fn().mockResolvedValue({});

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(201);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User created!",
        data: userCreated,
      });
      expect(mockedUserService.create).toBeCalledWith(userToCreate);
      expect(mockedUserService.create).toBeCalledTimes(1);
    });

    it("Should return 400 if name is not provided", async () => {
      const user = {
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      userSchema.validate = jest.fn().mockRejectedValue({
        errors: ["name is a required field"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["name is a required field"],
        data: null,
      });
    });

    it("Should return 400 if email is not provided", async () => {
      const user = {
        name: "any_name",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      userSchema.validate = jest.fn().mockRejectedValue({
        errors: ["email is a required field"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["email is a required field"],
        data: null,
      });
    });

    it("Should return 400 if email is invalid", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      userSchema.validate = jest.fn().mockRejectedValue({
        errors: ["email must be a valid email"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["email must be a valid email"],
        data: null,
      });
    });

    it("Should return 400 if password is not provided", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      userSchema.validate = jest.fn().mockRejectedValue({
        errors: ["password is a required field"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["password is a required field"],
        data: null,
      });
    });

    it("Should return 400 if password is less than 6 characters", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      userSchema.validate = jest.fn().mockRejectedValue({
        errors: ["password must be at least 6 characters"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["password must be at least 6 characters"],
        data: null,
      });
    });

    it("Should return 400 if user already exists", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.create.mockResolvedValue({
        status: 400,
        message: "User already exists!",
        data: null,
      });

      userSchema.validate = jest.fn().mockResolvedValue({});

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User already exists!",
        data: null,
      });
      expect(mockedUserService.create).toBeCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.create.mockResolvedValue({
        status: 500,
        message: "Internal Server Error",
        data: null,
      });

      userSchema.validate = jest.fn().mockResolvedValue({});

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(500);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Internal Server Error",
        data: null,
      });
      expect(mockedUserService.create).toBeCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should return 200 if user is updated successfully", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
        file: {
          filename: "any_filename",
          mimetype: "any_mimetype",
        },
        params: {
          id: "any_id",
        },
      });

      const userToUpdate = {
        ...user,
        image: {
          filename: "any_filename",
          mimetype: "any_mimetype",
        },
      };

      const userUpdated = {
        ...user,
        image: "any_image",
        patients: [],
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      };

      const mockedResponse = mockResponse();

      mockedUserService.update.mockResolvedValue({
        status: 200,
        message: "User updated!",
        data: userUpdated,
      });

      updateUserSchema.validate = jest.fn().mockResolvedValue({});

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(200);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User updated!",
        data: userUpdated,
      });
      expect(mockedUserService.update).toBeCalledWith("any_id", userToUpdate);
      expect(mockedUserService.update).toBeCalledTimes(1);
    });

    it("Should return 400 if password is less than 6 characters", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      updateUserSchema.validate = jest.fn().mockRejectedValue({
        errors: ["password must be at least 6 characters"],
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["password must be at least 6 characters"],
        data: null,
      });
    });

    it("Should return 404 if user is not found", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.update.mockResolvedValue({
        status: 404,
        message: "User not found!",
        data: null,
      });

      updateUserSchema.validate = jest.fn().mockResolvedValue({});

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(404);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User not found!",
        data: null,
      });
      expect(mockedUserService.update).toBeCalledTimes(1);
      expect(mockedUserService.update).toBeCalledWith("any_id", user);
    });

    it("Should return 500 if something goes wrong", async () => {
      const user = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.update.mockResolvedValue({
        status: 500,
        message: "Internal Server Error",
        data: null,
      });

      updateUserSchema.validate = jest.fn().mockResolvedValue({});

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(500);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Internal Server Error",
        data: null,
      });
      expect(mockedUserService.update).toBeCalledTimes(1);
      expect(mockedUserService.update).toBeCalledWith("any_id", user);
    });
  });

  describe("Delete", () => {
    it("Should return 200 if user is deleted successfully", async () => {
      const userDeleted = {
        id: "any_id",
        name: "any_name",
        email: "any_email",
        password: "any_password",
        file: "any_file",
        patients: [],
        createdAt: "any_createdAt",
        updatedAt: "any_updatedAt",
      };

      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.delete.mockResolvedValue({
        status: 200,
        message: "User deleted!",
        data: userDeleted,
      });

      await sut.delete(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(200);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User deleted!",
        data: userDeleted,
      });
      expect(mockedUserService.delete).toBeCalledTimes(1);
      expect(mockedUserService.delete).toBeCalledWith("any_id");
    });

    it("Should return 404 if user is not found", async () => {
      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.delete.mockResolvedValue({
        status: 404,
        message: "User not found!",
        data: null,
      });

      await sut.delete(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(404);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User not found!",
        data: null,
      });
      expect(mockedUserService.delete).toBeCalledTimes(1);
      expect(mockedUserService.delete).toBeCalledWith("any_id");
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.delete.mockResolvedValue({
        status: 500,
        message: "Internal Server Error",
        data: null,
      });

      await sut.delete(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(500);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Internal Server Error",
        data: null,
      });
      expect(mockedUserService.delete).toBeCalledTimes(1);
      expect(mockedUserService.delete).toBeCalledWith("any_id");
    });
  });

  describe("FindAllPatients", () => {
    it("Should return 200 if patients are found", async () => {
      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
        query: {
          page: "1",
          limit: "10",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.findAllPatients.mockResolvedValue({
        status: 200,
        message: "Patients found!",
        data: { patients: [] },
      });

      await sut.findAllPatients(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(200);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Patients found!",
        data: { patients: [] },
      });
      expect(mockedUserService.findAllPatients).toBeCalledTimes(1);
      expect(mockedUserService.findAllPatients).toBeCalledWith(
        "any_id",
        "1",
        "10"
      );
    });

    it("Should return the patients from page 1 and limit 10 if query is not provided", async () => {
      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.findAllPatients.mockResolvedValue({
        status: 200,
        message: "Patients found!",
        data: { patients: [] },
      });

      await sut.findAllPatients(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(200);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Patients found!",
        data: { patients: [] },
      });
      expect(mockedUserService.findAllPatients).toBeCalledTimes(1);
      expect(mockedUserService.findAllPatients).toBeCalledWith("any_id", 1, 10);
    });

    it("Should return 404 if user is not found", async () => {
      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
        query: {
          page: "1",
          limit: "10",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.findAllPatients.mockResolvedValue({
        status: 404,
        message: "User not found!",
        data: null,
      });

      await sut.findAllPatients(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(404);
      expect(mockedResponse.json).toBeCalledWith({
        message: "User not found!",
        data: null,
      });
      expect(mockedUserService.findAllPatients).toBeCalledTimes(1);
      expect(mockedUserService.findAllPatients).toBeCalledWith(
        "any_id",
        "1",
        "10"
      );
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: {
          id: "any_id",
        },
        query: {
          page: "1",
          limit: "10",
        },
      });

      const mockedResponse = mockResponse();

      mockedUserService.findAllPatients.mockResolvedValue({
        status: 500,
        message: "Internal Server Error",
        data: null,
      });

      await sut.findAllPatients(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(500);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Internal Server Error",
        data: null,
      });
      expect(mockedUserService.findAllPatients).toBeCalledTimes(1);
      expect(mockedUserService.findAllPatients).toBeCalledWith(
        "any_id",
        "1",
        "10"
      );
    });
  });
});
