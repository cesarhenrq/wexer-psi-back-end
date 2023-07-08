import Occurrence from "../entities/occurrence.entity";

import { CreateOccurrenceDto } from "../dtos/create-occurrence.dto";

export default class OccurrenceRepository {
  constructor(private model: typeof Occurrence) {}

  async create(occurrence: CreateOccurrenceDto) {
    return this.model.create(occurrence);
  }

  async findById(id: string) {
    return this.model.findById(id).populate("files");
  }
}
