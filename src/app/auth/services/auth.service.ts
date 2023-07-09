import UserRepository from "../../users/repositories/user.repository";

import { LoginDTO } from "../dtos/login.dto";

import { compare } from "bcryptjs";

import JWT from "jsonwebtoken";

export default class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(payload: LoginDTO) {
    try {
      const user = await this.userRepository.findByEmail(payload.email);

      if (!user) {
        return {
          status: 400,
          message: "E-mail/password invalid",
          data: null,
        };
      }

      const isPasswordValid = await compare(payload.password, user.password);

      if (!isPasswordValid) {
        return {
          status: 400,
          message: "E-mail/password invalid",
          data: null,
        };
      }

      const tokenPayload = { id: user.id };
      const secretKey = process.env.SECRET_KEY as string;
      const options = { expiresIn: "15m" };

      const token = JWT.sign(tokenPayload, secretKey, options);

      return {
        status: 200,
        data: { token, user },
        message: "You're authenticated!",
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
