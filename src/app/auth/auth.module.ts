import AuthService from "./services/auth.service";

import AuthController from "./controllers/auth.controller";

import UserModuleFactory from "../users/factories/module.factory";

export default class AuthModule {
  static build() {
    const service = new AuthService(UserModuleFactory.build().repository);
    const controller = new AuthController(service);

    return { controller, service };
  }
}
