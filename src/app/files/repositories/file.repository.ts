import File from "../entities/file.entity";

import { CreateFileDto } from "../dtos/create-file.dto";

export default class FileRepository {
  constructor(private model: typeof File) {}

  async create(file: CreateFileDto) {
    return await this.model.create(file);
  }

  async update(id: string, file: CreateFileDto) {
    return await this.model.findByIdAndUpdate(id, file, { new: true });
  }
}
