import { Request, Response } from "express";

import PatientService from "../services/patient.service";

import createPatientSchema from "../schemas/create-patient.schema";

export default class PatientController {
  constructor(private service: PatientService) {}

  async create(req: Request, res: Response) {
    const { body } = req;

    try {
      await createPatientSchema.validate(body);
    } catch (err: any) {
      return res.status(400).json({ message: err.message, data: null });
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
}
