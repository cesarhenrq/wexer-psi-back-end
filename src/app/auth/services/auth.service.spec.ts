import AuthService from "./auth.service";

import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";

import { LoginDTO } from "../dtos/login.dto";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const bcryptSpy = jest.spyOn(bcryptjs, "compare");

  const jwtSpy = jest.spyOn(JWT, "sign");

  const mockedUserRepository = {
    findByEmail: jest.fn(),
  };

  it("Should generate a token if the user exists and password is valid", async () => {
    const payload = {
      email: "test@gmail.com",
      password: "123456",
    } as LoginDTO;

    mockedUserRepository.findByEmail.mockResolvedValue({ ...payload, id: 1 });

    bcryptSpy.mockResolvedValue(true as never);

    jwtSpy.mockReturnValue({} as never);

    const expected = {
      status: 200,
      data: { token: {}, user: { ...payload, id: 1 } },
      message: "You're authenticated!",
    };

    const authService = new AuthService(mockedUserRepository as any);

    const result = await authService.login(payload);

    expect(result).toEqual(expected);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      payload.email
    );
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toHaveBeenCalledWith(payload.password, payload.password);
    expect(jwtSpy).toHaveBeenCalledTimes(1);
    expect(jwtSpy).toHaveBeenCalledWith({ id: 1 }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });
  });

  it("Should return an error if the user doesn't exist", async () => {
    const payload = {
      email: "test@gmail.com",
      password: "123456",
    } as LoginDTO;

    mockedUserRepository.findByEmail.mockResolvedValue(null);

    const expected = {
      status: 400,
      message: "E-mail/password invalid",
      data: null,
    };

    const authService = new AuthService(mockedUserRepository as any);

    const result = await authService.login(payload);

    expect(result).toEqual(expected);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      payload.email
    );
  });

  it("Should return an error if the password is invalid", async () => {
    const payload = {
      email: "test@gmail.com",
      password: "123456",
    } as LoginDTO;

    mockedUserRepository.findByEmail.mockResolvedValue({ ...payload, id: 1 });

    bcryptSpy.mockResolvedValue(false as never);

    const expected = {
      status: 400,
      message: "E-mail/password invalid",
      data: null,
    };

    const authService = new AuthService(mockedUserRepository as any);

    const result = await authService.login(payload);

    expect(result).toEqual(expected);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      payload.email
    );
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toHaveBeenCalledWith(payload.password, payload.password);
  });

  it("Should return an error if something goes wrong on repository", async () => {
    const payload = {
      email: "test@gmail.com",
      password: "123456",
    } as LoginDTO;

    mockedUserRepository.findByEmail.mockRejectedValue(new Error());

    const expected = {
      status: 500,
      message: "Internal server error",
      data: null,
    };

    const authService = new AuthService(mockedUserRepository as any);

    const result = await authService.login(payload);

    expect(result).toEqual(expected);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      payload.email
    );
  });
});
