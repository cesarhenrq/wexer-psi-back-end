import Occurrence from "../entities/occurrence.entity";

export default class OccurrenceRepository {
  constructor(private model: typeof Occurrence) {}
}
