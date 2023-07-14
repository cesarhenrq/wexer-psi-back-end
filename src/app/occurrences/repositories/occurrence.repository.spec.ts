import OccurrenceRepository from "./occurrence.repository";

describe("OccurrenceRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedModel: any = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const sut = new OccurrenceRepository(mockedModel);

  describe("Create", () => {
    it("Should create an occurrence", async () => {
      const mockedOccurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "any_kind",
      };

      const mockedCreatedOccurrence = {
        ...mockedOccurrence,
        files: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedModel.create.mockResolvedValueOnce(mockedCreatedOccurrence);

      const result = await sut.create(mockedOccurrence);

      expect(result).toEqual(mockedCreatedOccurrence);
      expect(mockedModel.create).toHaveBeenCalledWith(mockedOccurrence);
      expect(mockedModel.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if name is not provided", async () => {
      const mockedOccurrence: any = {
        content: "any_content",
        kind: "any_kind",
      };

      mockedModel.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedOccurrence).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedModel.create).toHaveBeenCalledWith(mockedOccurrence);
      expect(mockedModel.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if content is not provided", async () => {
      const mockedOccurrence: any = {
        name: "any_name",
        kind: "any_kind",
      };

      mockedModel.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedOccurrence).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedModel.create).toHaveBeenCalledWith(mockedOccurrence);
      expect(mockedModel.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if kind is not provided", async () => {
      const mockedOccurrence: any = {
        name: "any_name",
        content: "any_content",
      };

      mockedModel.create.mockRejectedValueOnce(new Error());

      const result = await sut.create(mockedOccurrence).catch((error) => error);

      expect(result).toEqual(new Error());
      expect(mockedModel.create).toHaveBeenCalledWith(mockedOccurrence);
      expect(mockedModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindById", () => {
    it("Should find an occurrence by id", async () => {
      const mockedOccurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "any_kind",
      };

      const mockedFoundOccurrence = {
        ...mockedOccurrence,
        files: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedModel.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(mockedFoundOccurrence),
      });

      const result = await sut.findById("any_id");

      expect(result).toEqual(mockedFoundOccurrence);
      expect(mockedModel.findById).toHaveBeenCalledWith("any_id");
      expect(mockedModel.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return null if occurrence is not found", async () => {
      mockedModel.findById.mockReturnValueOnce({
        populate: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await sut.findById("any_id");

      expect(result).toBeNull();
      expect(mockedModel.findById).toHaveBeenCalledWith("any_id");
      expect(mockedModel.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should update an occurrence", async () => {
      const mockedOccurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "any_kind",
      };

      const mockedUpdatedOccurrence = {
        ...mockedOccurrence,
        files: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedModel.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedOccurrence
      );

      const result = await sut.update("any_id", mockedOccurrence);

      expect(result).toEqual(mockedUpdatedOccurrence);
      expect(mockedModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedOccurrence,
        { new: true }
      );
      expect(mockedModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if occurrence is not found", async () => {
      const mockedOccurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "any_kind",
      };

      mockedModel.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.update("any_id", mockedOccurrence);

      expect(result).toBeNull();
      expect(mockedModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedOccurrence,
        { new: true }
      );
      expect(mockedModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
