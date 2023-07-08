import File from "../entities/file.entity";

import { CreateFileDto } from "../dtos/create-file.dto";

export default class FileRepository {
  constructor(private model: typeof File) {}

  async create(file: CreateFileDto) {
    return await this.model.create(file);
  }

  async createMany(files: CreateFileDto[]) {
    return await this.model.insertMany(files);
  }

  async update(id: string, file: CreateFileDto) {
    return await this.model.findByIdAndUpdate(id, file, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteMany(ids: string[]) {
    return this.model.deleteMany({ _id: { $in: ids } });
  }
}
