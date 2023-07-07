import OccurrenceService from "../services/occurrence.service";

import { Request, Response } from "express";

import createOccurrenceSchema from "../schemas/create-occurrence.schema";

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
}
