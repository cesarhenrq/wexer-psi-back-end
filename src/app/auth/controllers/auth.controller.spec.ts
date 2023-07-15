import AuthController from "./auth.controller";

import { mockRequest, mockResponse } from "jest-mock-req-res";

import loginSchema from "../schemas/login.schema";

jest.mock("../schemas/login.schema");

describe("AuthController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedAuthService: any = {
    login: jest.fn(),
  };

  const sut = new AuthController(mockedAuthService);

  describe("Login", () => {
    it("Should return 200 when login is successful", async () => {
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

      mockedAuthService.login.mockResolvedValue({
        status: 200,
        message: "You're authenticated!",
        data: { token: "any_token", user },
      });

      loginSchema.validate = jest.fn().mockResolvedValue({});

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(200);
      expect(mockedResponse.json).toBeCalledWith({
        message: "You're authenticated!",
        data: { token: "any_token", user },
      });
      expect(mockedAuthService.login).toBeCalledWith(user);
      expect(mockedAuthService.login).toBeCalledTimes(1);
    });

    it("Should return 400 if email is not provided", async () => {
      const user = {
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      loginSchema.validate = jest.fn().mockRejectedValue({
        errors: ["email is a required field"],
      });

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["email is a required field"],
        data: null,
      });
      expect(mockedAuthService.login).not.toBeCalled();
    });

    it("Should return 400 if email is invalid", async () => {
      const user = {
        email: "invalid_email",
        password: "any_password",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      loginSchema.validate = jest.fn().mockRejectedValue({
        errors: ["email must be a valid email"],
      });

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["email must be a valid email"],
        data: null,
      });
      expect(mockedAuthService.login).not.toBeCalled();
    });

    it("Should return 400 if password is not provided", async () => {
      const user = {
        email: "any_email",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      loginSchema.validate = jest.fn().mockRejectedValue({
        errors: ["password is a required field"],
      });

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["password is a required field"],
        data: null,
      });
      expect(mockedAuthService.login).not.toBeCalled();
    });

    it("Should return 400 if password is invalid", async () => {
      const user = {
        email: "any_email",
        password: "any",
      };

      const mockedRequest = mockRequest({
        body: {
          ...user,
        },
      });

      const mockedResponse = mockResponse();

      loginSchema.validate = jest.fn().mockRejectedValue({
        errors: ["password must be at least 6 characters"],
      });

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: ["password must be at least 6 characters"],
        data: null,
      });
      expect(mockedAuthService.login).not.toBeCalled();
    });

    it("Should return 400 if email/password is invalid", async () => {
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

      loginSchema.validate = jest.fn().mockResolvedValue({});

      mockedAuthService.login.mockResolvedValue({
        status: 400,
        message: "Invalid email/password",
        data: null,
      });

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(400);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Invalid email/password",
        data: null,
      });
      expect(mockedAuthService.login).toBeCalledWith(user);
      expect(mockedAuthService.login).toBeCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
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

      loginSchema.validate = jest.fn().mockResolvedValue({});

      mockedAuthService.login.mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.login(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toBeCalledWith(500);
      expect(mockedResponse.json).toBeCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockedAuthService.login).toBeCalledWith(user);
      expect(mockedAuthService.login).toBeCalledTimes(1);
    });
  });
});
