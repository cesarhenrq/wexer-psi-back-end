import File from "./entities/file.entity";

import FileRepository from "./repositories/file.repository";

export default class FileModule {
  static build() {
    const repository = new FileRepository(File);

    return { repository };
  }
}
