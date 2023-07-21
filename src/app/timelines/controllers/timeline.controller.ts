import { Request, Response } from "express";

import TimelineService from "../services/timeline.service";

import createTimelineSchema from "../schemas/create-timeline.schema";
import updateTimelineSchema from "../schemas/update-timeline.schema";

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

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const { body } = req;

    try {
      await updateTimelineSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({ message: err.errors, data: null });
    }

    const { status, message, data } = await this.service.update(id, body);

    return res.status(status).json({
      message,
      data,
    });
  }

  async findOccurrences(req: Request, res: Response) {
    const { id } = req.params;

    const { page = 1, limit = 10 } = req.query;

    const { status, message, data } = await this.service.findOccurrences(
      id,
      page,
      limit
    );

    return res.status(status).json({
      message,
      data,
    });
  }

  async delete(req: Request, res: Response) {
    const { id, patientId } = req.params;

    const { status, message, data } = await this.service.delete(id, patientId);

    return res.status(status).json({
      message,
      data,
    });
  }
}
