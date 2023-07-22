import { mock } from "node:test";
import PatientRepository from "./patient.repository";

describe("PatientRepository", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedPatientEntity: any = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const sut = new PatientRepository(mockedPatientEntity);

  describe("Create", () => {
    it("Should create a patient", async () => {
      const mockedPatient: any = {
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      const mockedCreatedPatient = {
        ...mockedPatient,
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedPatientEntity.create.mockResolvedValueOnce(mockedCreatedPatient);

      const result = await sut.create(mockedPatient);

      expect(result).toEqual(mockedCreatedPatient);
      expect(mockedPatientEntity.create).toHaveBeenCalledWith(mockedPatient);
      expect(mockedPatientEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if name is not provided", async () => {
      const mockedPatient: any = {
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      mockedPatientEntity.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedPatient).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedPatientEntity.create).toHaveBeenCalledWith(mockedPatient);
      expect(mockedPatientEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if contact is not provided", async () => {
      const mockedPatient: any = {
        name: "any_name",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      mockedPatientEntity.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedPatient).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedPatientEntity.create).toHaveBeenCalledWith(mockedPatient);
      expect(mockedPatientEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if birthdate is not provided", async () => {
      const mockedPatient: any = {
        name: "any_name",
        contact: "any_contact",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      mockedPatientEntity.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedPatient).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedPatientEntity.create).toHaveBeenCalledWith(mockedPatient);
      expect(mockedPatientEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if user is not provided", async () => {
      const mockedPatient: any = {
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        timelines: [],
      };

      mockedPatientEntity.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedPatient).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedPatientEntity.create).toHaveBeenCalledWith(mockedPatient);
      expect(mockedPatientEntity.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindById", () => {
    it("Should find a patient by id", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedPatientEntity.findById.mockResolvedValueOnce(mockedPatient);

      const result = await sut.findById("any_id");

      expect(result).toEqual(mockedPatient);
      expect(mockedPatientEntity.findById).toHaveBeenCalledWith("any_id");
      expect(mockedPatientEntity.findById).toBeCalledTimes(1);
    });

    it("Should return null if patient is not found", async () => {
      mockedPatientEntity.findById.mockResolvedValueOnce(null);

      const result = await sut.findById("any_id");

      expect(result).toBeNull();
      expect(mockedPatientEntity.findById).toHaveBeenCalledWith("any_id");
      expect(mockedPatientEntity.findById).toBeCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should update a patient", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      const mockedUpdatedPatient: any = {
        ...mockedPatient,
        name: "any_name_updated",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedPatientEntity.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedPatient
      );

      const result = await sut.update("any_id", mockedPatient);

      expect(result).toEqual(mockedUpdatedPatient);
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        mockedPatient._id,
        mockedPatient,
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if patient is not found", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      mockedPatientEntity.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.update("any_id", mockedPatient);

      expect(result).toBeNull();
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        mockedPatient._id,
        mockedPatient,
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe("AssociateTimeline", () => {
    it("Should associate a timeline to a patient", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      const mockedUpdatedPatient: any = {
        ...mockedPatient,
        timelines: ["any_timeline_id"],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedPatientEntity.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedPatient
      );

      const result = await sut.associateTimeline("any_id", "any_timeline_id");

      expect(result).toEqual(mockedUpdatedPatient);
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        mockedPatient._id,
        { $push: { timelines: "any_timeline_id" } },
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if patient is not found", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: [],
      };

      mockedPatientEntity.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.associateTimeline("any_id", "any_timeline_id");

      expect(result).toBeNull();
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        mockedPatient._id,
        { $push: { timelines: "any_timeline_id" } },
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe("DisassociateTimeline", () => {
    it("Should disassociate a timeline from a patient", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: ["any_timeline_id"],
      };

      const mockedUpdatedPatient: any = {
        ...mockedPatient,
        timelines: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedPatientEntity.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedPatient
      );

      const result = await sut.disassociateTimeline(
        "any_id",
        "any_timeline_id"
      );

      expect(result).toEqual(mockedUpdatedPatient);
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $pull: { timelines: "any_timeline_id" } },
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if patient is not found", async () => {
      mockedPatientEntity.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.disassociateTimeline(
        "any_id",
        "any_timeline_id"
      );

      expect(result).toBeNull();
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $pull: { timelines: "any_timeline_id" } },
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if timeline is not associated to patient", async () => {
      mockedPatientEntity.findByIdAndUpdate.mockRejectedValueOnce(new Error());

      const result = await sut
        .disassociateTimeline("any_id", "any_timeline_id")
        .catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $pull: { timelines: "any_timeline_id" } },
        { new: true }
      );
      expect(mockedPatientEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Delete", () => {
    it("Should delete a patient", async () => {
      const mockedPatient: any = {
        _id: "any_id",
        name: "any_name",
        contact: "any_contact",
        birthdate: "any_birthdate",
        demands: "any_demands",
        personalAnnotations: "any_personalAnnotations",
        user: "any_user",
        timelines: ["any_timeline_id"],
      };

      mockedPatientEntity.findByIdAndDelete.mockResolvedValueOnce(
        mockedPatient
      );

      const result = await sut.delete("any_id");

      expect(result).toEqual(mockedPatient);
      expect(mockedPatientEntity.findByIdAndDelete).toHaveBeenCalledWith(
        "any_id"
      );
      expect(mockedPatientEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it("Should return null if patient is not found", async () => {
      mockedPatientEntity.findByIdAndDelete.mockResolvedValueOnce(null);

      const result = await sut.delete("any_id");

      expect(result).toBeNull();
      expect(mockedPatientEntity.findByIdAndDelete).toHaveBeenCalledWith(
        "any_id"
      );
      expect(mockedPatientEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if patient has not been deleted", async () => {
      mockedPatientEntity.findByIdAndDelete.mockRejectedValueOnce(new Error());

      const result = await sut.delete("any_id").catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedPatientEntity.findByIdAndDelete).toHaveBeenCalledWith(
        "any_id"
      );
      expect(mockedPatientEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });
  });
});
