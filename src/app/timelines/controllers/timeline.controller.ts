import createTimelineSchema from "../schemas/create-timeline.schema";
import TimelineService from "../services/timeline.service";

import { Request, Response } from "express";

export default class TimelineController {
  constructor(private service: TimelineService) {}

  async create(req: Request, res: Response) {
    const { id } = req.params;

    const { body } = req;

    try {
      await createTimelineSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors,
        data: null,
      });
    }

    const { status, message, data } = await this.service.create(id, body);

    return res.status(status).json({
      message,
      data,
    });
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const { status, message, data } = await this.service.findById(id);

    return res.status(status).json({
      message,
      data,
    });
  }
}
