import PatientController from "./patient.controller";

import { mockRequest, mockResponse } from "jest-mock-req-res";

import createPatientSchema from "../schemas/create-patient.schema";
import updatePatientSchema from "../schemas/update-patient.schema";
import exp from "constants";

jest.mock("../schemas/create-patient.schema");
jest.mock("../schemas/update-patient.schema");

describe("PatientController", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockService: any = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findAllTimelines: jest.fn(),
  };

  const sut = new PatientController(mockService);

  describe("Create", () => {
    it("Should return 200 when create a patient", async () => {
      const patientToCreate = {
        user: "user_any",
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const patientCreated = {
        ...patientToCreate,
        _id: "id_any",
        timelines: [],
        createdAt: "createdAt_any",
        updatedAt: "updatedAt_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockResolvedValue({});

      mockService.create.mockResolvedValue({
        status: 200,
        message: "Patient created",
        data: patientCreated,
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Patient created",
        data: patientCreated,
      });
      expect(mockService.create).toHaveBeenCalledWith(patientToCreate);
      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if user is not provided", async () => {
      const patientToCreate = {
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockRejectedValue({
        errors: ["User is required"],
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["User is required"],
        data: null,
      });
      expect(mockService.create).not.toHaveBeenCalled();
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if name is not provided", async () => {
      const patientToCreate = {
        user: "user_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockRejectedValue({
        errors: ["name is required"],
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["name is required"],
        data: null,
      });
      expect(mockService.create).not.toHaveBeenCalled();
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if contact is not provided", async () => {
      const patientToCreate = {
        user: "user_any",
        name: "name_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockRejectedValue({
        errors: ["contact is required"],
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["contact is required"],
        data: null,
      });
      expect(mockService.create).not.toHaveBeenCalled();
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if birthdate is not provided", async () => {
      const patientToCreate = {
        user: "user_any",
        name: "name_any",
        contact: "contact_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockRejectedValue({
        errors: ["birthdate is required"],
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["birthdate is required"],
        data: null,
      });
      expect(mockService.create).not.toHaveBeenCalled();
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if birthdate is not a valid date", async () => {
      const patientToCreate = {
        user: "user_any",
        name: "name_any",
        contact: "contact_any",
        birthdate: "invalid_birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockRejectedValue({
        errors: ["birthdate must be a valid date"],
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["birthdate must be a valid date"],
        data: null,
      });
      expect(mockService.create).not.toHaveBeenCalled();
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if user does not exist", async () => {
      const patientToCreate = {
        user: "user_any",
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockResolvedValue({});

      mockService.create = jest.fn().mockResolvedValue({
        status: 404,
        message: "User not found",
        data: null,
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
        data: null,
      });
      expect(mockService.create).toHaveBeenCalledWith(patientToCreate);
      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const patientToCreate = {
        user: "user_any",
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ body: patientToCreate });

      const res = mockResponse();

      createPatientSchema.validate = jest.fn().mockResolvedValue({});

      mockService.create = jest.fn().mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockService.create).toHaveBeenCalledWith(patientToCreate);
      expect(mockService.create).toHaveBeenCalledTimes(1);
      expect(createPatientSchema.validate).toHaveBeenCalledWith(
        patientToCreate
      );
      expect(createPatientSchema.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindById", () => {
    it("Should return 200 if patient is found", async () => {
      const id = "patient_id_any";

      const req = mockRequest({ params: { id } });

      const res = mockResponse();

      mockService.findById = jest.fn().mockResolvedValue({
        status: 200,
        message: "Patient found",
        data: "patient_data_any",
      });

      await sut.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Patient found",
        data: "patient_data_any",
      });
      expect(mockService.findById).toHaveBeenCalledWith(id);
      expect(mockService.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient is not found", async () => {
      const id = "patient_id_any";

      const req = mockRequest({ params: { id } });

      const res = mockResponse();

      mockService.findById = jest.fn().mockResolvedValue({
        status: 404,
        message: "Patient not found",
        data: null,
      });

      await sut.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Patient not found",
        data: null,
      });
      expect(mockService.findById).toHaveBeenCalledWith(id);
      expect(mockService.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const id = "patient_id_any";

      const req = mockRequest({ params: { id } });

      const res = mockResponse();

      mockService.findById = jest.fn().mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockService.findById).toHaveBeenCalledWith(id);
      expect(mockService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should return 200 if patient is updated", async () => {
      const id = "patient_id_any";

      const patientToUpdate = {
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ params: { id }, body: patientToUpdate });

      const res = mockResponse();

      updatePatientSchema.validate = jest.fn().mockResolvedValue({});

      mockService.update = jest.fn().mockResolvedValue({
        status: 200,
        message: "Patient updated",
        data: "patient_data_any",
      });

      await sut.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Patient updated",
        data: "patient_data_any",
      });
      expect(mockService.update).toHaveBeenCalledWith(id, patientToUpdate);
      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(updatePatientSchema.validate).toHaveBeenCalledWith(
        patientToUpdate
      );
      expect(updatePatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if birthdate is not a valid date", async () => {
      const id = "patient_id_any";

      const patientToUpdate = {
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ params: { id }, body: patientToUpdate });

      const res = mockResponse();

      updatePatientSchema.validate = jest.fn().mockRejectedValue({
        errors: ["birthdate must be a valid date"],
      });

      await sut.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["birthdate must be a valid date"],
        data: null,
      });
      expect(mockService.update).not.toHaveBeenCalled();
      expect(updatePatientSchema.validate).toHaveBeenCalledWith(
        patientToUpdate
      );
      expect(updatePatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient is not found", async () => {
      const id = "patient_id_any";

      const patientToUpdate = {
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ params: { id }, body: patientToUpdate });

      const res = mockResponse();

      updatePatientSchema.validate = jest.fn().mockResolvedValue({});

      mockService.update = jest.fn().mockResolvedValue({
        status: 404,
        message: "Patient not found",
        data: null,
      });

      await sut.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Patient not found",
        data: null,
      });
      expect(mockService.update).toHaveBeenCalledWith(id, patientToUpdate);
      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(updatePatientSchema.validate).toHaveBeenCalledWith(
        patientToUpdate
      );
      expect(updatePatientSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const id = "patient_id_any";

      const patientToUpdate = {
        name: "name_any",
        contact: "contact_any",
        birthdate: "birthdate_any",
        demands: "demands_any",
        personalAnnotations: "personalAnnotations_any",
      };

      const req = mockRequest({ params: { id }, body: patientToUpdate });

      const res = mockResponse();

      updatePatientSchema.validate = jest.fn().mockResolvedValue({});

      mockService.update = jest.fn().mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockService.update).toHaveBeenCalledWith(id, patientToUpdate);
      expect(mockService.update).toHaveBeenCalledTimes(1);
      expect(updatePatientSchema.validate).toHaveBeenCalledWith(
        patientToUpdate
      );
      expect(updatePatientSchema.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindAllTimelines", () => {
    it("Should return 200 if timelines are found", async () => {
      const id = "patient_id_any";

      const req = mockRequest({
        params: { id },
        query: {
          page: "1",
          limit: "10",
        },
      });

      const res = mockResponse();

      mockService.findAllTimelines = jest.fn().mockResolvedValue({
        status: 200,
        message: "Timelines found",
        data: "timelines_data_any",
      });

      await sut.findAllTimelines(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Timelines found",
        data: "timelines_data_any",
      });
      expect(mockService.findAllTimelines).toHaveBeenCalledWith(id, "1", "10");
      expect(mockService.findAllTimelines).toHaveBeenCalledTimes(1);
    });

    it("Should return 10 timelines from page 1 if page and limit are not provided", async () => {
      const id = "patient_id_any";

      const req = mockRequest({
        params: { id },
        query: {},
      });

      const res = mockResponse();

      mockService.findAllTimelines = jest.fn().mockResolvedValue({
        status: 200,
        message: "Timelines found",
        data: "timelines_data_any",
      });

      await sut.findAllTimelines(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Timelines found",
        data: "timelines_data_any",
      });
      expect(mockService.findAllTimelines).toHaveBeenCalledWith(id, 1, 10);
      expect(mockService.findAllTimelines).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient is not found", async () => {
      const id = "patient_id_any";

      const req = mockRequest({
        params: { id },
        query: {
          page: "1",
          limit: "10",
        },
      });

      const res = mockResponse();

      mockService.findAllTimelines = jest.fn().mockResolvedValue({
        status: 404,
        message: "Patient not found",
        data: null,
      });

      await sut.findAllTimelines(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Patient not found",
        data: null,
      });
      expect(mockService.findAllTimelines).toHaveBeenCalledWith(id, "1", "10");
      expect(mockService.findAllTimelines).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const id = "patient_id_any";

      const req = mockRequest({
        params: { id },
        query: {
          page: "1",
          limit: "10",
        },
      });

      const res = mockResponse();

      mockService.findAllTimelines = jest.fn().mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.findAllTimelines(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockService.findAllTimelines).toHaveBeenCalledWith(id, "1", "10");
      expect(mockService.findAllTimelines).toHaveBeenCalledTimes(1);
    });
  });
});
