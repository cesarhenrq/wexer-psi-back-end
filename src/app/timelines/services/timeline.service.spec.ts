import TimelineService from "./timeline.service";

import paginate from "../../../utils/paginate";

jest.mock("../../../utils/paginate");

describe("Timeline service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const paginateModule = {
    paginate,
  };

  const mockedTimelineRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any;

  const mockedPatientRepository = {
    findById: jest.fn(),
    associateTimeline: jest.fn(),
    disassociateTimeline: jest.fn(),
  } as any;

  const mockedOccurrenceRepository: any = {
    delete: jest.fn(),
  };

  const mockedFileRepository: any = {
    deleteMany: jest.fn(),
  };

  const spyPaginate = jest.spyOn(paginateModule, "paginate");

  const sut = new TimelineService(
    mockedTimelineRepository,
    mockedPatientRepository,
    mockedOccurrenceRepository,
    mockedFileRepository
  );

  describe("Create a timeline", () => {
    const patient = {
      _id: "patient-id",
      name: "Patient 1",
    };

    const payload = {
      name: "Timeline 1",
    };

    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
    };

    it("Should create a timeline", async () => {
      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.create.mockResolvedValue(timeline);

      const expected = {
        status: 201,
        message: "Timeline created",
        data: timeline,
      };

      const result = await sut.create("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.create).toBeCalledWith(payload);
      expect(mockedTimelineRepository.create).toBeCalledTimes(1);
      expect(mockedPatientRepository.associateTimeline).toBeCalledWith(
        "patient-id",
        "timeline-id"
      );
      expect(mockedPatientRepository.associateTimeline).toBeCalledTimes(1);
    });

    it("Should return 404 if patient is not found during", async () => {
      mockedPatientRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Patient not found",
        data: null,
      };

      const result = await sut.create("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in patientRepository.findById", async () => {
      mockedPatientRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.create", async () => {
      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.create.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.create).toBeCalledWith(payload);
      expect(mockedTimelineRepository.create).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in patientRepository.associateTimeline", async () => {
      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.create.mockResolvedValue(timeline);

      mockedPatientRepository.associateTimeline.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("patient-id", payload);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.create).toBeCalledWith(payload);
      expect(mockedTimelineRepository.create).toBeCalledTimes(1);
      expect(mockedPatientRepository.associateTimeline).toBeCalledWith(
        "patient-id",
        "timeline-id"
      );
      expect(mockedPatientRepository.associateTimeline).toBeCalledTimes(1);
    });
  });

  describe("Find a timeline", () => {
    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
    };

    it("Should return a timeline", async () => {
      mockedTimelineRepository.findById.mockResolvedValue(timeline);

      const expected = {
        status: 200,
        message: "Timeline found",
        data: timeline,
      };

      const result = await sut.findById("timeline-id");

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 404 if timeline is not found", async () => {
      mockedTimelineRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Timeline not found",
        data: null,
      };

      const result = await sut.findById("timeline-id");

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.findById", async () => {
      mockedTimelineRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.findById("timeline-id");

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });
  });

  describe("Update a timeline", () => {
    const payload = {
      name: "Timeline 1",
    };

    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
    };

    it("Should update a timeline", async () => {
      mockedTimelineRepository.update.mockResolvedValue(timeline);

      const expected = {
        status: 200,
        message: "Timeline updated",
        data: timeline,
      };

      const result = await sut.update("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.update).toBeCalledWith(
        "timeline-id",
        payload
      );
      expect(mockedTimelineRepository.update).toBeCalledTimes(1);
    });

    it("Should return 404 if timeline is not found", async () => {
      mockedTimelineRepository.update.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Timeline not found",
        data: null,
      };

      const result = await sut.update("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.update).toBeCalledWith(
        "timeline-id",
        payload
      );
      expect(mockedTimelineRepository.update).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.update", async () => {
      mockedTimelineRepository.update.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.update).toBeCalledWith(
        "timeline-id",
        payload
      );
      expect(mockedTimelineRepository.update).toBeCalledTimes(1);
    });
  });

  describe("Find all occurrences", () => {
    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
      occurrences: Array(20).fill("occurrence-id"),
    };

    const occurrences = Array(10).fill({ name: "Occurrence 1" });

    it("Should return all occurrences", async () => {
      mockedTimelineRepository.findById.mockResolvedValue({
        ...timeline,
        populate: jest.fn(),
      });

      spyPaginate.mockReturnValue(occurrences);

      const expected = {
        status: 200,
        message: "Occurrences found",
        data: occurrences,
      };

      const result = await sut.findOccurrences("timeline-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
      expect(spyPaginate).toBeCalledWith(timeline.occurrences, 1, 10);
      expect(spyPaginate).toBeCalledTimes(1);
    });

    it("Should return 404 if timeline is not found", async () => {
      mockedTimelineRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Timeline not found",
        data: null,
      };

      const result = await sut.findOccurrences("timeline-id", 1, 10);

      expect(result).toEqual(expected);

      expect(mockedTimelineRepository.findById).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.findById", async () => {
      mockedTimelineRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.findOccurrences("timeline-id", 1, 10);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });
  });

  describe("Delete a timeline", () => {
    it("Should delete a timeline", async () => {
      const patient = {
        _id: "patient-id",
        name: "Patient 1",
      };

      const timeline = {
        _id: "timeline-id",
        name: "Timeline 1",
        occurrences: Array(20).fill({ _id: "occurrence-id" }),
      };

      const occurrence = {
        _id: "occurrence-id",
        name: "Occurrence 1",
        files: Array(20).fill("file-id"),
      };

      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(timeline);

      mockedOccurrenceRepository.delete.mockResolvedValue(occurrence);

      const expected = {
        status: 200,
        message: "Timeline deleted",
        data: timeline,
      };

      const result = await sut.delete("timeline-id", "patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.delete).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.delete).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.delete).toBeCalledWith("occurrence-id");
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(20);
      expect(mockedFileRepository.deleteMany).toBeCalledWith(occurrence.files);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(20);
      expect(mockedPatientRepository.disassociateTimeline).toBeCalledWith(
        "patient-id",
        "timeline-id"
      );
      expect(mockedPatientRepository.disassociateTimeline).toBeCalledTimes(1);
    });

    it("Should return 404 if patient is not found", async () => {
      mockedPatientRepository.findById.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Patient not found",
        data: null,
      };

      const result = await sut.delete("timeline-id", "patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 404 if timeline is not found", async () => {
      const patient = {
        _id: "patient-id",
        name: "Patient 1",
      };

      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(null);

      const expected = {
        status: 404,
        message: "Timeline not found",
        data: null,
      };

      const result = await sut.delete("timeline-id", "patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.delete).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.delete).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in patientRepository.findById", async () => {
      mockedPatientRepository.findById.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut
        .delete("timeline-id", "patient-id")
        .catch((err) => err);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.delete", async () => {
      const patient = {
        _id: "patient-id",
        name: "Patient 1",
      };

      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut
        .delete("timeline-id", "patient-id")
        .catch((err) => err);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.delete).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.delete).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in occurrenceRepository.delete", async () => {
      const patient = {
        _id: "patient-id",
        name: "Patient 1",
      };

      const timeline = {
        _id: "timeline-id",
        name: "Timeline 1",
        occurrences: Array(20).fill({ _id: "occurrence-id" }),
      };

      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(timeline);

      mockedOccurrenceRepository.delete.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete("timeline-id", "patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.delete).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.delete).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.delete).toBeCalledWith("occurrence-id");
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in fileRepository.deleteMany", async () => {
      const patient = {
        _id: "patient-id",
        name: "Patient 1",
      };

      const timeline = {
        _id: "timeline-id",
        name: "Timeline 1",
        occurrences: Array(20).fill({ _id: "occurrence-id" }),
      };

      const occurrence = {
        _id: "occurrence-id",
        name: "Occurrence 1",
        files: Array(20).fill("file-id"),
      };

      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(timeline);

      mockedOccurrenceRepository.delete.mockResolvedValue(occurrence);

      mockedFileRepository.deleteMany.mockRejectedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete("timeline-id", "patient-id");

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.delete).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.delete).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.delete).toBeCalledWith("occurrence-id");
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(1);
      expect(mockedFileRepository.deleteMany).toBeCalledWith(occurrence.files);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in patientRepository.disassociateTimeline", async () => {
      const patient = {
        _id: "patient-id",
        name: "Patient 1",
      };

      const timeline = {
        _id: "timeline-id",
        name: "Timeline 1",
        occurrences: Array(20).fill({ _id: "occurrence-id" }),
      };

      const occurrence = {
        _id: "occurrence-id",
        name: "Occurrence 1",
        files: Array(20).fill("file-id"),
      };

      mockedPatientRepository.findById.mockResolvedValue(patient);

      mockedTimelineRepository.delete.mockResolvedValue(timeline);

      mockedOccurrenceRepository.delete.mockResolvedValue(occurrence);

      mockedPatientRepository.disassociateTimeline.mockRejectedValue(
        new Error()
      );

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut
        .delete("timeline-id", "patient-id")
        .catch((err) => err);

      expect(result).toEqual(expected);
      expect(mockedPatientRepository.findById).toBeCalledWith("patient-id");
      expect(mockedPatientRepository.findById).toBeCalledTimes(1);
      expect(mockedTimelineRepository.delete).toBeCalledWith("timeline-id");
      expect(mockedTimelineRepository.delete).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.delete).toBeCalledWith("occurrence-id");
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(20);
      expect(mockedFileRepository.deleteMany).toBeCalledWith(occurrence.files);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(20);
      expect(mockedPatientRepository.disassociateTimeline).toBeCalledWith(
        "patient-id",
        "timeline-id"
      );
      expect(mockedPatientRepository.disassociateTimeline).toBeCalledTimes(1);
    });
  });
});
