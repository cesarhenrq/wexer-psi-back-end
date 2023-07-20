import OccurrenceService from "./occurrence.service";

describe("Occurrence service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedOccurrenceRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as any;

  const mockedTimelineRepository = {
    findById: jest.fn(),
    associateOccurrence: jest.fn(),
  } as any;

  const mockedFileRepository = {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  } as any;

  const sut = new OccurrenceService(
    mockedOccurrenceRepository,
    mockedTimelineRepository,
    mockedFileRepository
  );

  describe("Create a occurrence", () => {
    let payload: any;

    beforeEach(() => {
      payload = {
        name: "Occurrence name",
        content: "Occurrence content",
        kind: "session",
        files: Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" }),
      } as any;
    });

    const timeline = {
      id: "timeline-id",
      name: "Timeline name",
    };

    const files = Array(3).fill({
      _id: "file-id",
      filename: "file.jpg",
      mimetype: "image/jpeg",
    });

    const occurrence = {
      ...payload,
      files: files.map((file) => file._id),
      id: "occurrence-id",
    };

    it("Should create an occurrence", async () => {
      mockedTimelineRepository.findById.mockResolvedValueOnce(timeline);

      mockedFileRepository.createMany.mockResolvedValueOnce(files);

      mockedOccurrenceRepository.create.mockResolvedValue(occurrence);

      const expected = {
        status: 201,
        message: "Occurrence created successfully",
        data: occurrence,
      };

      const result = await sut.create("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.create).toHaveBeenCalledWith(payload);
      expect(mockedOccurrenceRepository.create).toBeCalledTimes(1);
      expect(mockedTimelineRepository.associateOccurrence).toHaveBeenCalledWith(
        "timeline-id",
        "occurrence-id"
      );
      expect(mockedTimelineRepository.associateOccurrence).toBeCalledTimes(1);
    });

    it("Should return 404 if timeline does not exist", async () => {
      mockedTimelineRepository.findById.mockResolvedValueOnce(null);

      const expected = {
        status: 404,
        message: "Timeline not found",
        data: null,
      };

      const result = await sut.create("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.findById", async () => {
      mockedTimelineRepository.findById.mockRejectedValueOnce(
        new Error("Server error")
      );

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in fileRepository.createMany", async () => {
      mockedTimelineRepository.findById.mockResolvedValue(timeline);

      mockedFileRepository.createMany.mockRejectedValue(
        new Error("Server error")
      );

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in occurrenceRepository.create", async () => {
      mockedTimelineRepository.findById.mockResolvedValue(timeline);

      mockedFileRepository.createMany.mockResolvedValue(payload.files);

      mockedOccurrenceRepository.create.mockRejectedValue(
        new Error("Server error")
      );

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.create).toHaveBeenCalledWith(payload);
      expect(mockedOccurrenceRepository.create).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in timelineRepository.associateOccurrence", async () => {
      mockedTimelineRepository.findById.mockResolvedValueOnce(timeline);

      mockedFileRepository.createMany.mockResolvedValueOnce(files);

      mockedOccurrenceRepository.create.mockResolvedValue(occurrence);

      mockedTimelineRepository.associateOccurrence.mockRejectedValue(
        new Error("Server error")
      );

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.create("timeline-id", payload);

      expect(result).toEqual(expected);
      expect(mockedTimelineRepository.findById).toHaveBeenCalledWith(
        "timeline-id"
      );
      expect(mockedTimelineRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.create).toHaveBeenCalledWith(payload);
      expect(mockedOccurrenceRepository.create).toBeCalledTimes(1);
      expect(mockedTimelineRepository.associateOccurrence).toHaveBeenCalledWith(
        "timeline-id",
        "occurrence-id"
      );
      expect(mockedTimelineRepository.associateOccurrence).toBeCalledTimes(1);
    });
  });

  describe("Find by id", () => {
    const occurrence = {
      id: "occurrence-id",
      name: "Occurrence name",
      content: "Occurrence content",
      kind: "Occurrence kind",
    };

    it("Should return an occurrence", async () => {
      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      const expected = {
        status: 200,
        message: "Occurrence found",
        data: occurrence,
      };

      const result = await sut.findById("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 404 if occurrence does not exist", async () => {
      mockedOccurrenceRepository.findById.mockResolvedValueOnce(null);

      const expected = {
        status: 404,
        message: "Occurrence not found",
        data: null,
      };

      const result = await sut.findById("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in occurrenceRepository.findById", async () => {
      mockedOccurrenceRepository.findById.mockRejectedValueOnce(
        new Error("Server error")
      );

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.findById("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
    });
  });

  describe("Update", () => {
    let occurrence: any;
    let payload: any;

    beforeEach(() => {
      occurrence = {
        id: "occurrence-id",
        name: "Occurrence name",
        content: "Occurrence content",
        kind: "Occurrence kind",
        files: [],
      };

      payload = {
        ...occurrence,
        files: Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" }),
      };
    });

    it("Should update an occurrence if it doesn't have any file", async () => {
      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      mockedFileRepository.createMany.mockResolvedValueOnce(
        Array(3).fill({
          _id: "file-id",
          filename: "file.jpg",
          mimetype: "image/jpeg",
        })
      );

      const updatedOccurrence = {
        ...occurrence,
        files: Array(3).fill("file-id"),
      };

      mockedOccurrenceRepository.update.mockResolvedValue({
        ...updatedOccurrence,
        populate: jest.fn(),
      });

      const expected = {
        status: 200,
        message: "Occurrence updated successfully",
        data: expect.objectContaining({
          ...updatedOccurrence,
          populate: expect.any(Function),
        }),
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toMatchObject(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.update).toHaveBeenCalledWith(
        "occurrence-id",
        updatedOccurrence
      );
      expect(mockedOccurrenceRepository.update).toBeCalledTimes(1);
    });

    it("Should update an occurrence if it has files", async () => {
      occurrence = {
        ...occurrence,
        files: [
          { _id: "file-id", filename: "file1.jpg", mimetype: "image/jpeg" },

          {
            _id: "file-id",
            filename: "file.jpg2",
            mimetype: "image/jpeg",
          },
        ],
      };

      const spySome = jest.spyOn(payload.files, "some");

      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      mockedFileRepository.createMany.mockResolvedValueOnce(
        Array(3).fill({
          _id: "file-id",
          filename: "file.jpg",
          mimetype: "image/jpeg",
        })
      );

      mockedFileRepository.deleteMany.mockResolvedValueOnce([
        { _id: "file-id", filename: "file.jpg2", mimetype: "image/jpeg" },
        { _id: "file-id", filename: "file.jpg1", mimetype: "image/jpeg" },
      ]);

      const updatedOccurrence = {
        ...occurrence,
        files: Array(3).fill(["file-id"]),
        populate: jest.fn(),
      };

      mockedOccurrenceRepository.update.mockResolvedValue(updatedOccurrence);

      const expected = {
        status: 200,
        message: "Occurrence updated successfully",
        data: expect.objectContaining({
          ...updatedOccurrence,
          populate: expect.any(Function),
        }),
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toMatchObject(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledWith([
        "file-id",
        "file-id",
      ]);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.update).toHaveBeenCalledWith(
        "occurrence-id",
        payload
      );
      expect(mockedOccurrenceRepository.update).toBeCalledTimes(1);
      expect(spySome).toBeCalledTimes(occurrence.files.length);
    });

    it("Should update an occurence if payload doesn't have files", async () => {
      payload = {
        name: "Occurrence name 2",
        content: "Occurrence content 2",
        kind: "Occurrence kind 2",
        files: undefined,
      };

      const updatedOccurrence = {
        ...payload,
        files: [],
      };

      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      mockedOccurrenceRepository.update.mockResolvedValue({
        ...updatedOccurrence,
        populate: jest.fn(),
      });

      const expected = {
        status: 200,
        message: "Occurrence updated successfully",
        data: expect.objectContaining({
          ...updatedOccurrence,
          populate: expect.any(Function),
        }),
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toMatchObject(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.update).toHaveBeenCalledWith(
        "occurrence-id",
        payload
      );
      expect(mockedOccurrenceRepository.update).toBeCalledTimes(1);
    });

    it("Should return 404 if occurrence does not exist", async () => {
      mockedOccurrenceRepository.findById.mockResolvedValueOnce(null);

      const expected = {
        status: 404,
        message: "Occurrence not found",
        data: null,
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in occurrenceRepository.findById", async () => {
      mockedOccurrenceRepository.findById.mockRejectedValueOnce(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in fileRepository.createMany", async () => {
      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      mockedFileRepository.createMany.mockRejectedValueOnce(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in fileRepository.deleteMany", async () => {
      occurrence = {
        ...occurrence,
        files: [
          { _id: "file-id", filename: "file1.jpg", mimetype: "image/jpeg" },

          {
            _id: "file-id",
            filename: "file.jpg2",
            mimetype: "image/jpeg",
          },
        ],
      };

      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      mockedFileRepository.createMany.mockResolvedValueOnce(
        Array(3).fill({
          _id: "file-id",
          filename: "file.jpg",
          mimetype: "image/jpeg",
        })
      );

      mockedFileRepository.deleteMany.mockRejectedValueOnce(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledWith([
        "file-id",
        "file-id",
      ]);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in occurrenceRepository.update", async () => {
      occurrence = {
        ...occurrence,
        files: [
          { _id: "file-id", filename: "file1.jpg", mimetype: "image/jpeg" },

          {
            _id: "file-id",
            filename: "file.jpg2",
            mimetype: "image/jpeg",
          },
        ],
      };

      mockedOccurrenceRepository.findById.mockResolvedValueOnce(occurrence);

      mockedFileRepository.createMany.mockResolvedValueOnce(
        Array(3).fill({
          _id: "file-id",
          filename: "file.jpg",
          mimetype: "image/jpeg",
        })
      );

      mockedFileRepository.deleteMany.mockResolvedValueOnce([
        { _id: "file-id", filename: "file.jpg2", mimetype: "image/jpeg" },
        { _id: "file-id", filename: "file.jpg1", mimetype: "image/jpeg" },
      ]);

      mockedOccurrenceRepository.update.mockResolvedValue(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.update("occurrence-id", payload);

      expect(result).toMatchObject(expected);
      expect(mockedOccurrenceRepository.findById).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.findById).toBeCalledTimes(1);
      expect(mockedFileRepository.createMany).toHaveBeenCalledWith(
        Array(3).fill({ filename: "file.jpg", mimetype: "image/jpeg" })
      );
      expect(mockedFileRepository.createMany).toBeCalledTimes(1);
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledWith([
        "file-id",
        "file-id",
      ]);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(1);
      expect(mockedOccurrenceRepository.update).toHaveBeenCalledWith(
        "occurrence-id",
        payload
      );
      expect(mockedOccurrenceRepository.update).toBeCalledTimes(1);
    });
  });

  describe("Delete", () => {
    it("Should delete an occurrence", async () => {
      mockedOccurrenceRepository.delete.mockResolvedValueOnce({});

      const expected = {
        status: 200,
        message: "Occurrence deleted successfully",
        data: {},
      };

      const result = await sut.delete("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(1);
    });

    it("Should delete an occurrence and associated files", async () => {
      const occurrence = {
        id: "occurrence-id",
        name: "Occurrence name",
        content: "Occurrence content",
        kind: "Occurrence kind",
        files: [
          { _id: "file-id", filename: "file1.jpg", mimetype: "image/jpeg" },

          {
            _id: "file-id",
            filename: "file.jpg2",
            mimetype: "image/jpeg",
          },
        ],
      };

      mockedOccurrenceRepository.delete.mockResolvedValueOnce(occurrence);

      mockedFileRepository.deleteMany.mockResolvedValueOnce([
        { _id: "file-id", filename: "file.jpg2", mimetype: "image/jpeg" },
        { _id: "file-id", filename: "file.jpg1", mimetype: "image/jpeg" },
      ]);

      const expected = {
        status: 200,
        message: "Occurrence deleted successfully",
        data: occurrence,
      };

      const result = await sut.delete("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(1);
      expect(mockedFileRepository.deleteMany).toHaveBeenCalledWith([
        "file-id",
        "file-id",
      ]);
      expect(mockedFileRepository.deleteMany).toBeCalledTimes(1);
    });

    it("Should return 404 if occurrence does not exist", async () => {
      mockedOccurrenceRepository.delete.mockResolvedValueOnce(null);

      const expected = {
        status: 404,
        message: "Occurrence not found",
        data: null,
      };

      const result = await sut.delete("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(1);
    });

    it("Should return 500 if an error occurs in occurrenceRepository.delete", async () => {
      mockedOccurrenceRepository.delete.mockRejectedValueOnce(new Error());

      const expected = {
        status: 500,
        message: "Internal server error",
        data: null,
      };

      const result = await sut.delete("occurrence-id");

      expect(result).toEqual(expected);
      expect(mockedOccurrenceRepository.delete).toHaveBeenCalledWith(
        "occurrence-id"
      );
      expect(mockedOccurrenceRepository.delete).toBeCalledTimes(1);
    });
  });
});
