import TimelineController from "./timeline.controller";

import { mockRequest, mockResponse } from "jest-mock-req-res";

import createTimelineSchema from "../schemas/create-timeline.schema";
import updateTimelineSchema from "../schemas/update-timeline.schema";

jest.mock("../schemas/create-timeline.schema");
jest.mock("../schemas/update-timeline.schema");

describe("TimelineController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockedService: any = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findOccurrences: jest.fn(),
  };

  const sut = new TimelineController(mockedService);

  describe("Create", () => {
    it("Should return 201 when create a timeline", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: { name: "any_name" },
      });

      const mockedResponse = mockResponse();

      createTimelineSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.create.mockResolvedValue({
        status: 201,
        message: "Timeline created successfully",
        data: { id: "any_id", name: "any_name" },
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline created successfully",
        data: { id: "any_id", name: "any_name" },
      });
      expect(mockedService.create).toHaveBeenCalledWith("1", {
        name: "any_name",
      });
      expect(mockedService.create).toHaveBeenCalledTimes(1);
      expect(createTimelineSchema.validate).toHaveBeenCalledWith({
        name: "any_name",
      });
      expect(createTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if name is not provided", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: {},
      });

      const mockedResponse = mockResponse();

      createTimelineSchema.validate = jest.fn().mockRejectedValue({
        errors: ["any_error"],
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(400);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: ["any_error"],
        data: null,
      });
      expect(createTimelineSchema.validate).toHaveBeenCalledWith({});
      expect(createTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if patient not found", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: { name: "any_name" },
      });

      const mockedResponse = mockResponse();

      createTimelineSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.create.mockResolvedValue({
        status: 404,
        message: "Patient not found",
        data: null,
      });

      await sut.create(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Patient not found",
        data: null,
      });
      expect(mockedService.create).toHaveBeenCalledWith("1", {
        name: "any_name",
      });
      expect(mockedService.create).toHaveBeenCalledTimes(1);
      expect(createTimelineSchema.validate).toHaveBeenCalledWith({
        name: "any_name",
      });
      expect(createTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: { name: "any_name" },
      });

      const mockedResponse = mockResponse();

      createTimelineSchema.validate = jest.fn().mockResolvedValue({});

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
      expect(mockedService.create).toHaveBeenCalledWith("1", {
        name: "any_name",
      });
      expect(mockedService.create).toHaveBeenCalledTimes(1);
      expect(createTimelineSchema.validate).toHaveBeenCalledWith({
        name: "any_name",
      });
      expect(createTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindById", () => {
    it("Should return 200 when find a timeline by id", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
      });

      const mockedResponse = mockResponse();

      mockedService.findById.mockResolvedValue({
        status: 200,
        message: "Timeline found successfully",
        data: { id: "any_id", name: "any_name" },
      });

      await sut.findById(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline found successfully",
        data: { id: "any_id", name: "any_name" },
      });
      expect(mockedService.findById).toHaveBeenCalledWith("1");
      expect(mockedService.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if timeline not found", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
      });

      const mockedResponse = mockResponse();

      mockedService.findById.mockResolvedValue({
        status: 404,
        message: "Timeline not found",
        data: null,
      });

      await sut.findById(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline not found",
        data: null,
      });
      expect(mockedService.findById).toHaveBeenCalledWith("1");
      expect(mockedService.findById).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
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
      expect(mockedService.findById).toHaveBeenCalledWith("1");
      expect(mockedService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("Should return 200 when update a timeline", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: { name: "any_name" },
      });

      const mockedResponse = mockResponse();

      updateTimelineSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.update.mockResolvedValue({
        status: 200,
        message: "Timeline updated successfully",
        data: { id: "any_id", name: "any_name" },
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline updated successfully",
        data: { id: "any_id", name: "any_name" },
      });
      expect(mockedService.update).toHaveBeenCalledWith("1", {
        name: "any_name",
      });
      expect(mockedService.update).toHaveBeenCalledTimes(1);
      expect(updateTimelineSchema.validate).toHaveBeenCalledWith({
        name: "any_name",
      });
      expect(updateTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 400 if validation fails", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: {},
      });

      const mockedResponse = mockResponse();

      updateTimelineSchema.validate = jest.fn().mockRejectedValue({
        errors: ["any_error"],
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(400);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: ["any_error"],
        data: null,
      });
      expect(updateTimelineSchema.validate).toHaveBeenCalledWith({});
      expect(updateTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if timeline not found", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: { name: "any_name" },
      });

      const mockedResponse = mockResponse();

      updateTimelineSchema.validate = jest.fn().mockResolvedValue({});

      mockedService.update.mockResolvedValue({
        status: 404,
        message: "Timeline not found",
        data: null,
      });

      await sut.update(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline not found",
        data: null,
      });
      expect(mockedService.update).toHaveBeenCalledWith("1", {
        name: "any_name",
      });
      expect(mockedService.update).toHaveBeenCalledTimes(1);
      expect(updateTimelineSchema.validate).toHaveBeenCalledWith({
        name: "any_name",
      });
      expect(updateTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        body: { name: "any_name" },
      });

      const mockedResponse = mockResponse();

      updateTimelineSchema.validate = jest.fn().mockResolvedValue({});

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
      expect(mockedService.update).toHaveBeenCalledWith("1", {
        name: "any_name",
      });
      expect(mockedService.update).toHaveBeenCalledTimes(1);
      expect(updateTimelineSchema.validate).toHaveBeenCalledWith({
        name: "any_name",
      });
      expect(updateTimelineSchema.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("FindOccurrences", () => {
    it("Should return 200 when find all occurrences", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
        query: { page: "1", limit: "10" },
      });

      const mockedResponse = mockResponse();

      mockedService.findOccurrences.mockResolvedValue({
        status: 200,
        message: "Occurrences found successfully",
        data: [{ id: "any_id", name: "any_name" }],
      });

      await sut.findOccurrences(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Occurrences found successfully",
        data: [{ id: "any_id", name: "any_name" }],
      });
      expect(mockedService.findOccurrences).toHaveBeenCalledWith(
        "1",
        "1",
        "10"
      );
      expect(mockedService.findOccurrences).toHaveBeenCalledTimes(1);
    });

    it("Should return 10 occurrences from page 1 if page and limit are not provided", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
      });

      const mockedResponse = mockResponse();

      mockedService.findOccurrences.mockResolvedValue({
        status: 200,
        message: "Occurrences found successfully",
        data: [{ id: "any_id", name: "any_name" }],
      });

      await sut.findOccurrences(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Occurrences found successfully",
        data: [{ id: "any_id", name: "any_name" }],
      });
      expect(mockedService.findOccurrences).toHaveBeenCalledWith("1", 1, 10);
      expect(mockedService.findOccurrences).toHaveBeenCalledTimes(1);
    });

    it("Should return 404 if timeline not found", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
      });

      const mockedResponse = mockResponse();

      mockedService.findOccurrences.mockResolvedValue({
        status: 404,
        message: "Timeline not found",
        data: null,
      });

      await sut.findOccurrences(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(404);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Timeline not found",
        data: null,
      });
      expect(mockedService.findOccurrences).toHaveBeenCalledWith("1", 1, 10);
      expect(mockedService.findOccurrences).toHaveBeenCalledTimes(1);
    });

    it("Should return 500 if something goes wrong", async () => {
      const mockedRequest = mockRequest({
        params: { id: "1" },
      });

      const mockedResponse = mockResponse();

      mockedService.findOccurrences.mockResolvedValue({
        status: 500,
        message: "Internal server error",
        data: null,
      });

      await sut.findOccurrences(mockedRequest, mockedResponse);

      expect(mockedResponse.status).toHaveBeenCalledWith(500);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
        data: null,
      });
      expect(mockedService.findOccurrences).toHaveBeenCalledWith("1", 1, 10);
      expect(mockedService.findOccurrences).toHaveBeenCalledTimes(1);
    });
  });
});
