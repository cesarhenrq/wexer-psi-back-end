import User from "./entities/user.entity";

import UserRepository from "./repositories/user.repository";

import UserService from "./services/user.service";

import UserController from "./controllers/user.controller";

import FileModule from "../files/file.module";

export default class UserModule {
  static build() {
    const repository = new UserRepository(User);
    const service = new UserService(repository, FileModule.build().repository);
    const controller = new UserController(service);

    return { controller, service, repository };
  }
}
