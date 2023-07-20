import TimelineRepository from "./timeline.repository";

describe("TimelineRepository", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedTimelineEntity: any = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const sut = new TimelineRepository(mockedTimelineEntity);

  describe("Create", () => {
    it("Should create a timeline", async () => {
      const mockedTimeline = {
        name: "any_name",
      };

      const mockedCreatedTimeline = {
        _id: "any_id",
        name: "any_name",
        occurrences: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedTimelineEntity.create.mockResolvedValueOnce(mockedCreatedTimeline);

      const result = await sut.create(mockedTimeline);

      expect(result).toEqual(mockedCreatedTimeline);
      expect(mockedTimelineEntity.create).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.create).toHaveBeenCalledWith(mockedTimeline);
    });

    it("Should throw an error if name is not provided", async () => {
      mockedTimelineEntity.create.mockRejectedValueOnce(new Error("any_error"));

      const result = await sut.create({} as any).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedTimelineEntity.create).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.create).toHaveBeenCalledWith({});
    });
  });

  describe("FindById", () => {
    it("Should find a timeline by id", async () => {
      const mockedFoundTimeline = {
        _id: "any_id",
        name: "any_name",
        occurrences: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedTimelineEntity.findById.mockResolvedValueOnce(mockedFoundTimeline);

      const result = await sut.findById("any_id");

      expect(result).toEqual(mockedFoundTimeline);
      expect(mockedTimelineEntity.findById).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findById).toHaveBeenCalledWith("any_id");
    });

    it("Should return null if timeline is not found", async () => {
      mockedTimelineEntity.findById.mockResolvedValueOnce(null);

      const result = await sut.findById("any_id");

      expect(result).toEqual(null);
      expect(mockedTimelineEntity.findById).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findById).toHaveBeenCalledWith("any_id");
    });
  });

  describe("Update", () => {
    it("Should update a timeline", async () => {
      const mockedTimeline = {
        name: "any_name",
      };

      const mockedUpdatedTimeline = {
        _id: "any_id",
        name: "any_name",
        occurrences: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      mockedTimelineEntity.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedTimeline
      );

      const result = await sut.update("any_id", mockedTimeline);

      expect(result).toEqual(mockedUpdatedTimeline);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedTimeline,
        { new: true }
      );
    });

    it("Should return null if timeline is not found", async () => {
      mockedTimelineEntity.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.update("any_id", {} as any);

      expect(result).toEqual(null);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        {},
        { new: true }
      );
    });
  });

  describe("AssociateOccurrence", () => {
    it("Should associate an occurrence to a timeline", async () => {
      const mockedTimeline = {
        _id: "any_id",
        name: "any_name",
        occurrences: [],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      const mockedUpdatedTimeline = {
        ...mockedTimeline,
        occurrences: ["any_occurrence_id"],
      };

      mockedTimelineEntity.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedTimeline
      );

      const result = await sut.associateOccurrence(
        "any_id",
        "any_occurrence_id"
      );

      expect(result).toEqual(mockedUpdatedTimeline);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        {
          $push: { occurrences: "any_occurrence_id" },
        },
        { new: true }
      );
    });

    it("Should return null if timeline is not found", async () => {
      mockedTimelineEntity.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.associateOccurrence(
        "any_id",
        "any_occurrence_id"
      );

      expect(result).toEqual(null);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        {
          $push: { occurrences: "any_occurrence_id" },
        },
        { new: true }
      );
    });
  });

  describe("DissociateOccurrence", () => {
    it("Should dissociate an occurrence from a timeline", async () => {
      const mockedTimeline = {
        _id: "any_id",
        name: "any_name",
        occurrences: ["any_occurrence_id"],
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      const mockedUpdatedTimeline = {
        ...mockedTimeline,
        occurrences: [],
      };

      mockedTimelineEntity.findByIdAndUpdate.mockResolvedValueOnce(
        mockedUpdatedTimeline
      );

      const result = await sut.desassociateOccurrence(
        "any_id",
        "any_occurrence_id"
      );

      expect(result).toEqual(mockedUpdatedTimeline);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $pull: { occurrences: "any_occurrence_id" } },
        { new: true }
      );
    });

    it("Should return null if timeline is not found", async () => {
      mockedTimelineEntity.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await sut.desassociateOccurrence(
        "any_id",
        "any_occurrence_id"
      );

      expect(result).toEqual(null);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $pull: { occurrences: "any_occurrence_id" } },
        { new: true }
      );
    });

    it("Should throw an error if occurrence is not associated to timeline", async () => {
      mockedTimelineEntity.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("any_error")
      );

      const result = await sut
        .desassociateOccurrence("any_id", "any_occurrence_id")
        .catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockedTimelineEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        { $pull: { occurrences: "any_occurrence_id" } },
        { new: true }
      );
    });
  });
});
