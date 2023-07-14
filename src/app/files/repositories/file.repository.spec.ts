import FileRepository from "./file.repository";

describe("File repository", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockedFileEntity: any = {
    create: jest.fn(),
    insertMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
  };

  const sut = new FileRepository(mockedFileEntity);

  describe("Create", () => {
    it("Should create a file", async () => {
      const mockedFile = {
        filename: "any_filename",
        mimetype: "any_mimetype",
      };

      mockedFileEntity.create.mockResolvedValue({
        ...mockedFile,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      });

      const expected = {
        ...mockedFile,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      const result = await sut.create(mockedFile);

      expect(result).toEqual(expected);
      expect(mockedFileEntity.create).toHaveBeenCalledWith(mockedFile);
      expect(mockedFileEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if filename is not provided", async () => {
      const mockedFile: any = {
        mimetype: "any_mimetype",
      };

      mockedFileEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedFile).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedFileEntity.create).toHaveBeenCalledWith(mockedFile);
      expect(mockedFileEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if mimetype is not provided", async () => {
      const mockedFile: any = {
        filename: "any_filename",
      };

      mockedFileEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedFile).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedFileEntity.create).toHaveBeenCalledWith(mockedFile);
      expect(mockedFileEntity.create).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if filename and mimetype are not provided", async () => {
      const mockedFile: any = {};

      mockedFileEntity.create.mockRejectedValue(new Error("any_error"));

      const result = await sut.create(mockedFile).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedFileEntity.create).toHaveBeenCalledWith(mockedFile);
      expect(mockedFileEntity.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("Create many", () => {
    it("Should create many files", async () => {
      const mockedFiles = Array(2).fill({
        filename: "any_filename",
        mimetype: "any_mimetype",
      });

      const mockedFilesCreated = mockedFiles.map((file) => ({
        ...file,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      }));

      mockedFileEntity.insertMany.mockResolvedValue(mockedFilesCreated);

      const expected = mockedFilesCreated;

      const result = await sut.createMany(mockedFiles);

      expect(result).toEqual(expected);
      expect(mockedFileEntity.insertMany).toHaveBeenCalledWith(mockedFiles);
      expect(mockedFileEntity.insertMany).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if filename is not provided", async () => {
      const mockedFiles: any = Array(2).fill({
        mimetype: "any_mimetype",
      });

      mockedFileEntity.insertMany.mockRejectedValue(new Error("any_error"));

      const result = await sut.createMany(mockedFiles).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedFileEntity.insertMany).toHaveBeenCalledWith(mockedFiles);
      expect(mockedFileEntity.insertMany).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if mimetype is not provided", async () => {
      const mockedFiles: any = Array(2).fill({
        filename: "any_filename",
      });

      mockedFileEntity.insertMany.mockRejectedValue(new Error("any_error"));

      const result = await sut.createMany(mockedFiles).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedFileEntity.insertMany).toHaveBeenCalledWith(mockedFiles);
      expect(mockedFileEntity.insertMany).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if filename and mimetype are not provided", async () => {
      const mockedFiles: any = Array(2).fill({});

      mockedFileEntity.insertMany.mockRejectedValue(new Error("any_error"));

      const result = await sut.createMany(mockedFiles).catch((error) => error);

      expect(result).toEqual(new Error("any_error"));
      expect(mockedFileEntity.insertMany).toHaveBeenCalledWith(mockedFiles);
      expect(mockedFileEntity.insertMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update", () => {
    const mockedFile = {
      filename: "any_filename",
      mimetype: "any_mimetype",
    };

    it("Should update a file", async () => {
      mockedFileEntity.findByIdAndUpdate.mockResolvedValue({
        ...mockedFile,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      });

      const expected = {
        ...mockedFile,
        _id: "any_id",
        createdAt: "any_date",
        updatedAt: "any_date",
      };

      const result = await sut.update("any_id", mockedFile);

      expect(result).toEqual(expected);
      expect(mockedFileEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedFile,
        { new: true }
      );
      expect(mockedFileEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it("Should return null if file is not found", async () => {
      mockedFileEntity.findByIdAndUpdate.mockResolvedValue(null);

      const result = await sut.update("any_id", mockedFile);

      expect(result).toBeNull();
      expect(mockedFileEntity.findByIdAndUpdate).toHaveBeenCalledWith(
        "any_id",
        mockedFile,
        { new: true }
      );
      expect(mockedFileEntity.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Delete", () => {
    const mockedDeleteFile = {
      _id: "any_id",
      filename: "any_filename",
      mimetype: "any_mimetype",
      createdAt: "any_date",
      updatedAt: "any_date",
    };

    it("Should delete a file", async () => {
      mockedFileEntity.findByIdAndDelete.mockResolvedValue(mockedDeleteFile);

      const expected = mockedDeleteFile;

      const result = await sut.delete("any_id");

      expect(result).toEqual(expected);
      expect(mockedFileEntity.findByIdAndDelete).toHaveBeenCalledWith("any_id");
      expect(mockedFileEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it("Should return null if file is not found", async () => {
      mockedFileEntity.findByIdAndDelete.mockResolvedValue(null);

      const result = await sut.delete("any_id");

      expect(result).toBeNull();
      expect(mockedFileEntity.findByIdAndDelete).toHaveBeenCalledWith("any_id");
      expect(mockedFileEntity.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Delete many", () => {
    it("Should delete many files", async () => {
      const mockedDeleteFiles = Array(2).fill({
        _id: "any_id",
        filename: "any_filename",
        mimetype: "any_mimetype",
        createdAt: "any_date",
        updatedAt: "any_date",
      });

      const filesToDelete = mockedDeleteFiles.map((file) => file._id);

      mockedFileEntity.deleteMany.mockResolvedValue(mockedDeleteFiles);

      const expected = mockedDeleteFiles;

      const result = await sut.deleteMany(filesToDelete);

      expect(result).toEqual(expected);
      expect(mockedFileEntity.deleteMany).toHaveBeenCalledWith({
        _id: { $in: filesToDelete },
      });
      expect(mockedFileEntity.deleteMany).toHaveBeenCalledTimes(1);
    });
  });
});
