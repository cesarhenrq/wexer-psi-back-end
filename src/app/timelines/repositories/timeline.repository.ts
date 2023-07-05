import Timeline from "../entities/timeline.entity";

export default class TimelineRepository {
  constructor(private model: typeof Timeline) {}
}
