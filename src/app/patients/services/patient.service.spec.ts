import PatientService from "./patient.service";

import paginate from "../../../utils/paginate";

jest.mock("../../../utils/paginate");

describe("Patient service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const paginateModule = {
    paginate,
  };

  const mockedUserRepository: any = {
    findById: jest.fn(),
    associatePatient: jest.fn(),
    disassociatePatient: jest.fn(),
  };

  const mockedPatientRepository: any = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockedTimelineRepository: any = {
    delete: jest.fn(),
  };

  const mockedOccurrenceRepository: any = {
    delete: jest.fn(),
  };

  const mockedFileRepository: any = {
    deleteMany: jest.fn(),
  };

  const spyPaginate = jest.spyOn(paginateModule, "paginate");

  const sut = new PatientService(
    mockedPatientRepository,
    mockedUserRepository,
    mockedTimelineRepository,
    mockedOccurrenceRepository,
    mockedFileRepository
  );

  describe("Create patient", () => {
    const payload = {
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

    const patient = {
      _id: "patient-id",
      ...payload,
    };

    it("Should create a patient", async () => {
      mockedUserRepository.findById.mockResolvedValue({ name: "John Doe 2" });

      mockedPatientRepository.create.mockResolvedValue(patient);

      const expected = {
        status: 201,
        message: "Patient created",
        data: patient,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(payload.user);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.associatePatient).toHaveBeenCalledWith(
        payload.user,
        patient._id
      );
      expect(mockedUserRepository.associatePatient).toHaveBeenCalledTimes(1);
      expect(mockedPatientRepository.create).toHaveBeenCalledWith(payload);
      expect(mockedPatientRepository.create).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if user not found", async () => {
      mockedUserRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "User not found",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(payload.user);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in userRepository.findById", async () => {
      mockedUserRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(payload.user);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in patientRepository.create", async () => {
      mockedUserRepository.findById.mockResolvedValue({ name: "John Doe 2" });

      mockedPatientRepository.create.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(payload.user);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedPatientRepository.create).toHaveBeenCalledWith(payload);
      expect(mockedPatientRepository.create).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in userRepository.associatePatient", async () => {
      mockedUserRepository.findById.mockResolvedValue({ name: "John Doe 2" });

      mockedPatientRepository.create.mockResolvedValue(patient);

      mockedUserRepository.associatePatient.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create(payload);

      expect(result).toEqual(expected);
      expect(mockedUserRepository.findById).toHaveBeenCalledWith(payload.user);
      expect(mockedUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.associatePatient).toHaveBeenCalledWith(
        payload.user,
        patient._id
      );
      expect(mockedUserRepository.associatePatient).toHaveBeenCalledTimes(1);
      expect(mockedPatientRepository.create).toHaveBeenCalledWith(payload);
      expect(mockedPatientRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("Find patient by id", () => {
    const patient = {
      _id: "patient-id",
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

    it("Should return a patient", async () => {
      mockedPatientRepository.findById.mockResolvedValue(patient);

      const expected = {
        status: 200,
        message: "Patient found",
        data: patient,
      };

      const result = await sut.findById(patient._id);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        patient._id
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient not found", async () => {
      mockedPatientRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Patient not found",
        data: null,
      };

      const result = await sut.findById("patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        "patient-id"
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in patientRepository.findById", async () => {
      mockedPatientRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.findById("patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        "patient-id"
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update patient", () => {
    const payload = {
      contact: "doe@email.com",
    };

    const patient = {
      _id: "patient-id",
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
    };

    const updatedPatient = {
      ...patient,
      contact: "doe@email.com",
    };

    it("Should update a patient", async () => {
      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedPatientRepository.update.mockResolvedValue(updatedPatient);

      const expected = {
        status: 200,
        message: "Patient updated",
        data: updatedPatient,
      };

      const result = await sut.update(patient._id, payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        patient._id
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedPatientRepository.update).toHaveBeenCalledWith(
        patient._id,
        payload
      );
      expect(mockedPatientRepository.update).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient not found", async () => {
      mockedPatientRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Patient not found",
        data: null,
      };

      const result = await sut.update("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        "patient-id"
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in patientRepository.findById", async () => {
      mockedPatientRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        "patient-id"
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in patientRepository.update", async () => {
      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedPatientRepository.update.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update(patient._id, payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        patient._id
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockedPatientRepository.update).toHaveBeenCalledWith(
        "patient-id",
        payload
      );
      expect(mockedPatientRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("Find all timelines", () => {
    const patient = {
      _id: "patient-id",
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
      timelines: Array(20).fill("timeline-id"),
    };

    const timelines = Array(10).fill({ _id: "timeline-id" });

    it("Should retrieve all timelines", async () => {
      mockedPatientRepository.findById.mockResolvedValue({
        ...patient,
        populate: jest
          .fn()
          .mockResolvedValue(Array(20).fill({ _id: "timeline-id" })),
      });

      spyPaginate.mockReturnValue(timelines);

      const expected = {
        status: 200,
        message: "Patient timelines found",
        data: timelines,
      };

      const result = await sut.findAllTimelines(patient._id, 1, 10);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        patient._id
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
      expect(spyPaginate).toHaveBeenCalledWith(
        (patient as any).timelines,
        1,
        10
      );
      expect(spyPaginate).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient not found during", async () => {
      mockedPatientRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Patient not found",
        data: null,
      };

      const result = await sut.findAllTimelines("patient-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        "patient-id"
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in patientRepository.findById", async () => {
      mockedPatientRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.findAllTimelines("patient-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toHaveBeenCalledWith(
        "patient-id"
      );
      expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Delete patient", () => {
    it("Should delete a patient", async () => {
      const patient = {
        user: "user-id",
        _id: "patient-id",
        name: "John Doe",
        timelines: Array(10).fill("timeline-id"),
      };

      const timeline = {
        _id: "timeline-id",
        occurrences: Array(10).fill("occurrence-id"),
      };

      const occurrence = {
        _id: "occurrence-id",
        files: Array(10).fill("file-id"),
      };

      mockedPatientRepository.delete.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(timeline);

      mockedOccurrenceRepository.delete.mockResolvedValue(occurrence);

      const expected = {
        status: 200,
        message: "Patient deleted",
        data: patient,
      };

      const result = await sut.delete(patient._id);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith(patient._id);
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledWith(
        patient.user,
        patient._id
      );
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledTimes(1);
      expect(mockedTimelineRepository.delete).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.delete).toHaveBeenCalledTimes(10);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledTimes(100);
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledWith(
        Array(10).fill("file-id")
      );
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledTimes(100);
    });

    it("Should return 404 if patient not found", async () => {
      mockedPatientRepository.delete.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Patient not found",
        data: null,
      };

      const result = await sut.delete("patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith("patient-id");
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in patientRepository.delete", async () => {
      mockedPatientRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete("patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith("patient-id");
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in userRepository.disassociatePatient", async () => {
      const patient = {
        user: "user-id",
        _id: "patient-id",
        name: "John Doe",
        timelines: Array(10).fill("timeline-id"),
      };

      mockedPatientRepository.delete.mockResolvedValue(patient);

      mockedUserRepository.disassociatePatient.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete(patient._id);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith(patient._id);
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledWith(
        patient.user,
        patient._id
      );
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in timelineRepository.delete", async () => {
      const patient = {
        user: "user-id",
        _id: "patient-id",
        name: "John Doe",
        timelines: Array(10).fill("timeline-id"),
      };

      mockedPatientRepository.delete.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete(patient._id);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith(patient._id);
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledWith(
        patient.user,
        patient._id
      );
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledTimes(1);
      expect(mockedTimelineRepository.delete).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong in occurrenceRepository.delete", async () => {
      const patient = {
        user: "user-id",
        _id: "patient-id",
        name: "John Doe",
        timelines: Array(10).fill("timeline-id"),
      };

      const timeline = {
        _id: "timeline-id",
        occurrences: Array(10).fill("occurrence-id"),
      };

      mockedPatientRepository.delete.mockResolvedValue(patient);
      mockedTimelineRepository.delete.mockResolvedValue(timeline);
      mockedOccurrenceRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete(patient._id);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith(patient._id);
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledWith(
        patient.user,
        patient._id
      );
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledTimes(1);
      expect(mockedTimelineRepository.delete).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
    });

    it("Should return 500 if something goes wrong in fileRepository.deleteMany", async () => {
      const patient = {
        user: "user-id",
        _id: "patient-id",
        name: "John Doe",
        timelines: Array(10).fill("timeline-id"),
      };

      const timeline = {
        _id: "timeline-id",
        occurrences: Array(10).fill("occurrence-id"),
      };

      const occurrence = {
        _id: "occurrence-id",
        files: Array(10).fill("file-id"),
      };

      mockedPatientRepository.delete.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(timeline);

      mockedOccurrenceRepository.delete.mockResolvedValue(occurrence);

      mockedFileRepository.deleteMany.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete(patient._id);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.delete).toHaveBeenCalledWith(patient._id);
      expect(mockedPatientRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledWith(
        "user-id",
        patient._id
      );
      expect(mockedUserRepository.disassociatePatient).toHaveBeenCalledTimes(1);
      expect(mockedTimelineRepository.delete).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledWith(
        Array(10).fill("file-id")
      );
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledTimes(1);
    });
  });
});
