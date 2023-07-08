import OccurrenceService from "../services/occurrence.service";

import { Request, Response } from "express";

import createOccurrenceSchema from "../schemas/create-occurrence.schema";
import updateOccurrenceSchema from "../schemas/update-occurrence.schema";

export default class OccurrenceController {
  constructor(private service: OccurrenceService) {}

  async create(req: Request, res: Response) {
    const { id } = req.params;
    let { body, files } = req;

    try {
      await createOccurrenceSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors,
        data: null,
      });
    }

    let payload = { ...body };

    if (files) {
      files = (files as []).map((file: any) => ({
        filename: file.filename,
        mimetype: file.mimetype,
      })) as [];

      payload = { ...payload, files };
    }

    const { status, message, data } = await this.service.create(id, payload);

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
    let { body, files } = req;

    try {
      await updateOccurrenceSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({
        message: err.errors,
        data: null,
      });
    }

    let payload = { ...body };

    if (files) {
      files = (files as []).map((file: any) => ({
        filename: file.filename,
        mimetype: file.mimetype,
      })) as [];

      payload = { ...payload, files };
    }

    const { status, message, data } = await this.service.update(id, payload);

    return res.status(status).json({
      message,
      data,
    });
  }
}
