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
  } as any;

  const mockedPatientRepository = {
    findById: jest.fn(),
    associateTimeline: jest.fn(),
  } as any;

  const spyPaginate = jest.spyOn(paginateModule, "paginate");

  const sut = new TimelineService(
    mockedTimelineRepository,
    mockedPatientRepository
  );

  it("Should create a timeline", async () => {
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

  it("Should return 404 if patient is not found during create a timeline", async () => {
    const payload = {
      name: "Timeline 1",
    };

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

  it("Should return 500 if an error occurs in patientRepository.findById during create a timeline", async () => {
    const payload = {
      name: "Timeline 1",
    };

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

  it("Should return 500 if an error occurs in timelineRepository.create during create a timeline", async () => {
    const patient = {
      _id: "patient-id",
      name: "Patient 1",
    };

    const payload = {
      name: "Timeline 1",
    };

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

  it("Should return 500 if an error occurs in patientRepository.associateTimeline during create a timeline", async () => {
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

  it("Should return a timeline", async () => {
    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
    };

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

  it("Should return 404 if timeline is not found during find timeline", async () => {
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

  it("Should return 500 if an error occurs in timelineRepository.findById during find timeline", async () => {
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

  it("Should update a timeline", async () => {
    const payload = {
      name: "Timeline 1",
    };

    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
    };

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

  it("Should return 404 if timeline is not found during update a timeline", async () => {
    const payload = {
      name: "Timeline 1",
    };

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

  it("Should return 500 if an error occurs in timelineRepository.update during update a timeline", async () => {
    const payload = {
      name: "Timeline 1",
    };

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

  it("Should return all occurrences of a timeline", async () => {
    const timeline = {
      _id: "timeline-id",
      name: "Timeline 1",
      occurrences: Array(20).fill("occurrence-id"),
    };

    const occurrences = Array(10).fill({ name: "Occurrence 1" });

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

  it("Should return 404 if timeline is not found during find occurrences of a timeline", async () => {
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

  it("Should return 500 if an error occurs in timelineRepository.findById during find occurrences of a timeline", async () => {
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
