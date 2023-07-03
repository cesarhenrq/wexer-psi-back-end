import AuthService from "./services/auth.service";

import AuthController from "./controllers/auth.controller";

import UserModule from "../users/user.module";

export default class AuthModule {
  static build() {
    const service = new AuthService(UserModule.build().repository);
    const controller = new AuthController(service);

    return { controller, service };
  }
}
