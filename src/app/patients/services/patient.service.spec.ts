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

  const mockedUserRepository = {
    findById: jest.fn(),
    associatePatient: jest.fn(),
  } as any;

  const mockedPatientRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  } as any;

  const spyPaginate = jest.spyOn(paginateModule, "paginate");

  const sut = new PatientService(mockedPatientRepository, mockedUserRepository);

  it("Should create a patient", async () => {
    const payload = {
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

    mockedUserRepository.findById.mockResolvedValue({ name: "John Doe 2" });

    const patient = {
      _id: "patient-id",
      ...payload,
    };

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
    const payload = {
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

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

  it("Should return 500 if something goes wrong in userRepository.findById during create patient", async () => {
    const payload = {
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

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

  it("Should return 500 if something goes wrong in patientRepository.create during create patient", async () => {
    const payload = {
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

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

  it("Should return 500 if something goes wrong in userRepository.associatePatient during create patient", async () => {
    const payload = {
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

    mockedUserRepository.findById.mockResolvedValue({ name: "John Doe 2" });

    const patient = {
      _id: "patient-id",
      ...payload,
    };

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

  it("Should return a patient", async () => {
    const patient = {
      _id: "patient-id",
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
      birthdate: new Date(),
      demands: "Testing",
      personalAnnotations: "Testing",
    };

    mockedPatientRepository.findById.mockResolvedValue(patient);

    const expected = {
      status: 200,
      message: "Patient found",
      data: patient,
    };

    const result = await sut.findById(patient._id);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith(patient._id);
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
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith("patient-id");
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
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith("patient-id");
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("Should update a patient", async () => {
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

    mockedPatientRepository.findById.mockResolvedValue(patient);

    mockedPatientRepository.update.mockResolvedValue(updatedPatient);

    const expected = {
      status: 200,
      message: "Patient updated",
      data: updatedPatient,
    };

    const result = await sut.update(patient._id, payload);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith(patient._id);
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockedPatientRepository.update).toHaveBeenCalledWith(
      patient._id,
      payload
    );
    expect(mockedPatientRepository.update).toHaveBeenCalledTimes(1);
  });

  it("Should return 404 if patient not found during update", async () => {
    const payload = {
      contact: "doe@email.com",
    };

    mockedPatientRepository.findById.mockResolvedValue(null);

    const expected = {
      status: 404,
      message: "Patient not found",
      data: null,
    };

    const result = await sut.update("patient-id", payload);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith("patient-id");
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("Should return 500 if something goes wrong in patientRepository.findById during update", async () => {
    const payload = {
      contact: "doe@email.com",
    };

    mockedPatientRepository.findById.mockRejectedValue(new Error());

    const expected = {
      status: 500,
      message: "Internal server error",
      data: null,
    };

    const result = await sut.update("patient-id", payload);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith("patient-id");
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("Should return 500 if something goes wrong in patientRepository.update during update", async () => {
    const payload = {
      contact: "doe@email.com",
    };

    const patient = {
      _id: "patient-id",
      user: "user-id",
      name: "John Doe",
      contact: "john@email.com",
    };

    mockedPatientRepository.findById.mockResolvedValue(patient);

    mockedPatientRepository.update.mockRejectedValue(new Error());

    const expected = {
      status: 500,
      message: "Internal server error",
      data: null,
    };

    const result = await sut.update(patient._id, payload);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith(patient._id);
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockedPatientRepository.update).toHaveBeenCalledWith(
      "patient-id",
      payload
    );
    expect(mockedPatientRepository.update).toHaveBeenCalledTimes(1);
  });

  it("Should retrieve all timelines", async () => {
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

    mockedPatientRepository.findById.mockResolvedValue({
      ...patient,
      populate: jest
        .fn()
        .mockResolvedValue(Array(20).fill({ _id: "timeline-id" })),
    });

    const timelines = Array(10).fill({ _id: "timeline-id" });

    spyPaginate.mockReturnValue(timelines);

    const expected = {
      status: 200,
      message: "Patient timelines found",
      data: timelines,
    };

    const result = await sut.findAllTimelines(patient._id, 1, 10);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith(patient._id);
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
    expect(spyPaginate).toHaveBeenCalledWith((patient as any).timelines, 1, 10);
    expect(spyPaginate).toHaveBeenCalledTimes(1);
  });

  it("Should return 404 if patient not found during findAllTimelines", async () => {
    mockedPatientRepository.findById.mockResolvedValue(null);

    const expected = {
      status: 404,
      message: "Patient not found",
      data: null,
    };

    const result = await sut.findAllTimelines("patient-id", 1, 10);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith("patient-id");
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("Should return 500 if something goes wrong in patientRepository.findById during findAllTimelines", async () => {
    mockedPatientRepository.findById.mockRejectedValue(new Error());

    const expected = {
      status: 500,
      message: "Internal server error",
      data: null,
    };

    const result = await sut.findAllTimelines("patient-id", 1, 10);

    expect(result).toEqual(expected);
    expect(mockedPatientRepository.findById).toHaveBeenCalledWith("patient-id");
    expect(mockedPatientRepository.findById).toHaveBeenCalledTimes(1);
  });
});
