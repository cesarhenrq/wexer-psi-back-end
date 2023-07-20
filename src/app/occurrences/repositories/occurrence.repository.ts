import Occurrence from "../entities/occurrence.entity";

import { CreateOccurrenceDto } from "../dtos/create-occurrence.dto";
import { UpdateOccurrenceDto } from "../dtos/update-occurrences.dto";

export default class OccurrenceRepository {
  constructor(private model: typeof Occurrence) {}

  async create(occurrence: CreateOccurrenceDto) {
    return this.model.create(occurrence);
  }

  async findById(id: string) {
    return this.model.findById(id).populate("files");
  }

  async update(id: string, occurrence: UpdateOccurrenceDto) {
    return this.model.findByIdAndUpdate(id, occurrence, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
