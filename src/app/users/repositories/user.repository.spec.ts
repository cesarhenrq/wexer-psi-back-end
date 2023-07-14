import UserRepository from "./user.repository";

describe("UserRepository", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedUserEntity: any = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
  };

  const sut = new UserRepository(mockedUserEntity);

  describe("Create", () => {
    it("Should create a user", async () => {
      const mockedUser = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      const mockedUserCreated: any = {
        ...mockedUser,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedUserEntity.create.mockResolvedValue(mockedUserCreated);

      const expected = { ...mockedUserCreated };

      const result = await sut.create(mockedUser);

      expect(result).toEqual(expected);
      expect(mockedUserEntity.create).toHaveBeenCalledWith(mockedUser);
      expect(mockedUserEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if name is not provided", async () => {
      const mockedUser: any = {
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      mockedUserEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedUser).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedUserEntity.create).toHaveBeenCalledWith(mockedUser);
      expect(mockedUserEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if email is not provided", async () => {
      const mockedUser: any = {
        name: "any_name",
        password: "any_password",
        image: "any_image",
      };

      mockedUserEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedUser).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedUserEntity.create).toHaveBeenCalledWith(mockedUser);
      expect(mockedUserEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if password is not provided", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        image: "any_image",
      };

      mockedUserEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedUser).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedUserEntity.create).toHaveBeenCalledWith(mockedUser);
      expect(mockedUserEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if email already exists", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      mockedUserEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedUser).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedUserEntity.create).toHaveBeenCalledWith(mockedUser);
      expect(mockedUserEntity.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindByEmail", () => {
    it("Should find a user by email", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      const mockedUserFound: any = {
        ...mockedUser,
        _id: {
          _id: "any_id",
          filename: "any_filename",
          mimetype: "any_mimetype",
          updatedAt: "any_date",
          createdAt: "any_date",
        },
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedUserEntity.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockedUserFound),
      });

      const expected = { ...mockedUserFound };

      const result = await sut.findByEmail(mockedUser.email);

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findOne).toHaveBeenCalledWith({
        email: mockedUser.email,
      });
      expect(mockedUserEntity.findOne).toHaveBeenCalledTimes(1);
    });

    it("Should return null if user is not found", async () => {
      mockedUserEntity.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const expected = null;

      const result = await sut.findByEmail("any@email.com");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findOne).toHaveBeenCalledWith({
        email: "any@email.com",
      });
      expect(mockedUserEntity.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should update a user", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      const mockedUserUpdated: any = {
        ...mockedUser,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedUserEntity.findByIdAndUpdate.mockResolvedValue(mockedUserUpdated);

      const expected = { ...mockedUserUpdated };

      const result = await sut.update("any_id", mockedUser);

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedUser,
        { new: true }
      );
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if user is not found", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      mockedUserEntity.findByIdAndUpdate.mockResolvedValue(null);

      const expected = null;

      const result = await sut.update("any_id", mockedUser);

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedUser,
        { new: true }
      );
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Delete", () => {
    it("Should delete a user", async () => {
      const mockedDeletedUser: any = {
        _id: "any_id",
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedUserEntity.findByIdAndDelete.mockResolvedValue(mockedDeletedUser);

      const expected = { ...mockedDeletedUser };

      const result = await sut.delete("any_id");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findByIdAndDelete).toHaveBeenCalledWith("any_id");
      expect(mockedUserEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it("Should return null if user is not found", async () => {
      mockedUserEntity.findByIdAndDelete.mockResolvedValue(null);

      const expected = null;

      const result = await sut.delete("any_id");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findByIdAndDelete).toHaveBeenCalledWith("any_id");
      expect(mockedUserEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindById", () => {
    it("Should find a user by id", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      const mockedUserFound: any = {
        ...mockedUser,
        file: {
          _id: "any_id",
          filename: "any_filename",
          mimetype: "any_mimetype",
          updatedAt: "any_date",
          createdAt: "any_date",
        },
        patients: Array(2).fill({
          _id: "any_id",
          name: "any_name",
          contact: "any_email",
          birthDate: "any_date",
          createdAt: "any_date",
          updatedAt: "any_date",
        }),
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedUserEntity.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockedUserFound),
        }),
      });

      const expected = { ...mockedUserFound };

      const result = await sut.findById("any_id");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findById).toHaveBeenCalledWith("any_id");
      expect(mockedUserEntity.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return null if user is not found", async () => {
      mockedUserEntity.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });

      const expected = null;

      const result = await sut.findById("any_id");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findById).toHaveBeenCalledWith("any_id");
      expect(mockedUserEntity.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("AssociatePatient", () => {
    it("Should associate a patient", async () => {
      const mockedUser: any = {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        image: "any_image",
      };

      const mockedUserUpdated: any = {
        ...mockedUser,
        file: "any_id",
        patients: Array(2).fill("any_patient_id"),
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedUserEntity.findByIdAndUpdate.mockResolvedValue(mockedUserUpdated);

      const expected = { ...mockedUserUpdated };

      const result = await sut.associatePatient("any_id", "any_patient_id");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        {
          $push: { patients: "any_patient_id" },
        },
        { new: true }
      );
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if user is not found", async () => {
      mockedUserEntity.findByIdAndUpdate.mockResolvedValue(null);

      const expected = null;

      const result = await sut.associatePatient("any_id", "any_patient_id");

      expect(result).toEqual(expected);
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $push: { patients: "any_patient_id" } },
        { new: true }
      );
      expect(mockedUserEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
