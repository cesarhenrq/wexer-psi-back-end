import OccurrenceRepository from "../repositories/occurrence.repository";
import TimelineRepository from "../../timelines/repositories/timeline.repository";

export default class OccurrenceService {
  constructor(
    private occurrenceRepository: OccurrenceRepository,
    private timelineRepository: TimelineRepository
  ) {}
}
