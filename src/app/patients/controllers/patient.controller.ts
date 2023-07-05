import { Request, Response } from "express";

import PatientService from "../services/patient.service";

import createPatientSchema from "../schemas/create-patient.schema";
import updatePatientSchema from "../schemas/update-patient.schema";

export default class PatientController {
  constructor(private service: PatientService) {}

  async create(req: Request, res: Response) {
    const { body } = req;

    try {
      await createPatientSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({ message: err.errors, data: null });
    }

    const { status, message, data } = await this.service.create(body);

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
      await updatePatientSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({ message: err.errors, data: null });
    }

    const { status, message, data } = await this.service.update(id, body);

    return res.status(status).json({
      message,
      data,
    });
  }

  async findAllTimelines(req: Request, res: Response) {
    const { id } = req.params;

    const { page = 1, limit = 10 } = req.query;

    const { status, message, data } = await this.service.findAllTimelines(
      id,
      page,
      limit
    );

    return res.status(status).json({
      message,
      data,
    });
  }
}
