import OccurrenceController from "./occurrence.controller";

import { mockRequest, mockResponse } from "jest-mock-req-res";

import createOccurrenceSchema from "../schemas/create-occurrence.schema";
import updateOccurrenceSchema from "../schemas/update-occurrence.schema";

jest.mock("../schemas/create-occurrence.schema");
jest.mock("../schemas/update-occurrence.schema");

describe("OccurrenceController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedService: any = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const sut = new OccurrenceController(mockedService);

  describe("Create", () => {
    it("Should return 201 when create a occurrence", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const occurrenceToCreate = {
        ...occurrence,
        files: Array(2).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        files: Array(2).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
        params: {
          id: "any_timeline_id",
        },
      });

      const mockedResponse = mockResponse();

      createOccurrenceSchema.validate = jest.fn().mockReturnValue({});

      const mockedCreateResponse = {
        status: 201,
        message: "any_message",
        data: "any_data",
      };

      mockedService.create.mockResolvedValue(mockedCreateResponse);

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "any_message",
        data: "any_data",
      });
      expect(createOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(createOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.create).toHaveBeenCalledWith(
        "any_timeline_id",
        occurrenceToCreate
      );
      expect(mockedService.create).toBeCalledTimes(1);
    });

    it("Should return 201 when create a occurrence without files", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_timeline_id",
        },
      });

      const mockedResponse = mockResponse();

      createOccurrenceSchema.validate = jest.fn().mockReturnValue({});

      const mockedCreateResponse = {
        status: 201,
        message: "any_message",
        data: "any_data",
      };

      mockedService.create.mockResolvedValue(mockedCreateResponse);

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "any_message",
        data: "any_data",
      });
      expect(createOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(createOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.create).toHaveBeenCalledWith(
        "any_timeline_id",
        occurrence
      );
      expect(mockedService.create).toBeCalledTimes(1);
    });

    it("Should return 400 when create a occurrence with invalid body", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_timeline_id",
        },
      });

      const mockedResponse = mockResponse();

      createOccurrenceSchema.validate = jest.fn().mockRejectedValue({
        errors: ["any_error"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(400);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: ["any_error"],
        data: null,
      });
      expect(createOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(createOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.create).not.toHaveBeenCalled();
    });

    it("Should return 404 if a timeline is not found", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_timeline_id",
        },
      });

      const mockedResponse = mockResponse();

      createOccurrenceSchema.validate = jest.fn().mockReturnValue({});

      mockedService.create.mockResolvedValue({
        status: 404,
        message: "Timeline not found",
        data: null,
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline not found",
        data: null,
      });
      expect(createOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(createOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.create).toHaveBeenCalledWith(
        "any_timeline_id",
        occurrence
      );
      expect(mockedService.create).toBeCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_timeline_id",
        },
      });

      const mockedResponse = mockResponse();

      createOccurrenceSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.create.mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(500);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(createOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(createOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.create).toHaveBeenCalledWith(
        "any_timeline_id",
        occurrence
      );
      expect(mockedService.create).toBeCalledTimes(1);
    });
  });

  describe("FindById", () => {
    it("Should return 200 when find a occurrence by id", async () => {
      const mockedRequest = mockRequest({
        params: { id: "any_id" },
      });

      const mockedResponse = mockResponse();

      const mockedFindByIdResponse = {
        status: 200,
        message: "any_message",
        data: "any_data",
      };

      mockedService.findById.mockResolvedValue(mockedFindByIdResponse);

      await sut.findById(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "any_message",
        data: "any_data",
      });
      expect(mockedService.findById).toHaveBeenCalledWith("any_id");
      expect(mockedService.findById).toBeCalledTimes(1);
    });

    it("Should return 404 if a occurrence is not found", async () => {
      const mockedRequest = mockRequest({
        params: { id: "any_id" },
      });

      const mockedResponse = mockResponse();

      mockedService.findById.mockResolvedValue({
        status: 404,
        message: "Occurrence not found",
        data: null,
      });

      await sut.findById(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Occurrence not found",
        data: null,
      });
      expect(mockedService.findById).toHaveBeenCalledWith("any_id");
      expect(mockedService.findById).toBeCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: { id: "any_id" },
      });

      const mockedResponse = mockResponse();

      mockedService.findById.mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.findById(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(500);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockedService.findById).toHaveBeenCalledWith("any_id");
      expect(mockedService.findById).toBeCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should return 200 when update a occurrence", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_id",
        },
        files: Array(3).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      });

      const occurrenceToUpdate: any = {
        ...occurrence,
        files: Array(3).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      };

      const mockedResponse = mockResponse();

      const mockedUpdateResponse = {
        status: 200,
        message: "any_message",
        data: "any_data",
      };

      updateOccurrenceSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.update.mockResolvedValue(mockedUpdateResponse);

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "any_message",
        data: "any_data",
      });
      expect(updateOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(updateOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.update).toHaveBeenCalledWith(
        "any_id",
        occurrenceToUpdate
      );
      expect(mockedService.update).toBeCalledTimes(1);
    });

    it("Should return 200 when update a occurrence without files", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      const mockedUpdateResponse = {
        status: 200,
        message: "any_message",
        data: "any_data",
      };

      updateOccurrenceSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.update.mockResolvedValue(mockedUpdateResponse);

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "any_message",
        data: "any_data",
      });
      expect(updateOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(updateOccurrenceSchema.validate).toBeCalledTimes(1);
      expect(mockedService.update).toHaveBeenCalledWith("any_id", occurrence);
      expect(mockedService.update).toBeCalledTimes(1);
    });

    it("Should return 400 if validation fails", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_id",
        },
      });

      const mockedResponse = mockResponse();

      updateOccurrenceSchema.validate = jest.fn().mockRejectedValue({
        errors: ["any_error"],
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(400);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: ["any_error"],
        data: null,
      });
      expect(updateOccurrenceSchema.validate).toHaveBeenCalledWith(occurrence);
      expect(updateOccurrenceSchema.validate).toBeCalledTimes(1);
    });

    it("Should return 404 if a occurrence is not found", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_id",
        },
        files: Array(3).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      });

      const occurrenceToUpdate: any = {
        ...occurrence,
        files: Array(3).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      };

      const mockedResponse = mockResponse();

      updateOccurrenceSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.update.mockResolvedValue({
        status: 404,
        message: "Occurrence not found",
        data: null,
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Occurrence not found",
        data: null,
      });
      expect(mockedService.update).toHaveBeenCalledWith(
        "any_id",
        occurrenceToUpdate
      );
      expect(mockedService.update).toBeCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const occurrence: any = {
        name: "any_name",
        content: "any_content",
        kind: "session",
      };

      const mockedRequest = mockRequest({
        body: occurrence,
        params: {
          id: "any_id",
        },
        files: Array(3).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      });

      const occurrenceToUpdate: any = {
        ...occurrence,
        files: Array(3).fill({
          filename: "any_filename",
          mimetype: "any_mimetype",
        }),
      };

      const mockedResponse = mockResponse();

      updateOccurrenceSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.update.mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(500);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockedService.update).toHaveBeenCalledWith(
        "any_id",
        occurrenceToUpdate
      );
      expect(mockedService.update).toBeCalledTimes(1);
    });
  });

  describe("Delete", () => {
    it("Should return 200 when delete a occurrence", async () => {
      const mockedRequest = mockRequest({
        params: { id: "any_id" },
      });

      const mockedResponse = mockResponse();

      const mockedDeleteResponse = {
        status: 200,
        message: "any_message",
        data: "any_data",
      };

      mockedService.delete.mockResolvedValue(mockedDeleteResponse);

      await sut.delete(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "any_message",
        data: "any_data",
      });
      expect(mockedService.delete).toHaveBeenCalledWith("any_id");
      expect(mockedService.delete).toBeCalledTimes(1);
    });

    it("Should return 404 if a occurrence is not found", async () => {
      const mockedRequest = mockRequest({
        params: { id: "any_id" },
      });

      const mockedResponse = mockResponse();

      mockedService.delete.mockResolvedValue({
        status: 404,
        message: "Occurrence not found",
        data: null,
      });

      await sut.delete(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Occurrence not found",
        data: null,
      });
      expect(mockedService.delete).toHaveBeenCalledWith("any_id");
      expect(mockedService.delete).toBeCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: { id: "any_id" },
      });

      const mockedResponse = mockResponse();

      mockedService.delete.mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.delete(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(500);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockedService.delete).toHaveBeenCalledWith("any_id");
      expect(mockedService.delete).toBeCalledTimes(1);
    });
  });
});
