import Timeline from "../entities/timeline.entity";

import { CreateTimelineDto } from "../dtos/create-timeline.dto";
import { UpdateTimelineDto } from "../dtos/update-timeline.dto";

export default class TimelineRepository {
  constructor(private model: typeof Timeline) {}

  async create(timeline: CreateTimelineDto) {
    return await this.model.create(timeline);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, timeline: UpdateTimelineDto) {
    return this.model.findByIdAndUpdate(id, timeline, { new: true });
  }
}
