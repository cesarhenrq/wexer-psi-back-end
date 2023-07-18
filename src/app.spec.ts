import app from "./app";

import AuthModule from "./app/auth/auth.module";

import { disconnect } from "mongoose";

import request from "supertest";

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("Auth routes", () => {
    describe("POST /auth", () => {
      const route = "/auth";

      it("Should be able to authenticate an user", async () => {
        const user = {
          email: "cesar@gmail.com",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("token");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data.user).toHaveProperty("_id");
        expect(response.body.data.user).toHaveProperty("image");
        expect(response.body.data.user).toHaveProperty("createdAt");
        expect(response.body.data.user).toHaveProperty("updatedAt");
        expect(response.body.data.user).toHaveProperty("name");
        expect(response.body.data.user).toHaveProperty("email");
        expect(response.body.data.user).toHaveProperty("password");
        expect(response.body.message).toBe("You're authenticated!");
      });

      it("Should not be able to authenticate an user if password is wrong", async () => {
        const user = {
          email: "cesar@gmail.com",
          password: "1234567",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("E-mail/password invalid");
      });

      it("Should not be able to authenticate an user if email is wrong", async () => {
        const user = {
          email: "cesa@gmail.com",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("E-mail/password invalid");
      });

      it("Should not be able to authenticate an user if email is not provided", async () => {
        const user = {
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["email is a required field"]);
      });

      it("Should not be able to authenticate an user if password is not provided", async () => {
        const user = {
          email: "cesar@gmail.com",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["password is a required field"]);
      });

      it("Should not be able to authenticate an user if email is not valid", async () => {
        const user = {
          email: "cesar",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["email must be a valid email"]);
      });

      it("Should not be able to authenticate an user if password is not valid", async () => {
        const user = {
          email: "cesar@gmail.com",
          password: "123",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual([
          "password must be at least 6 characters",
        ]);
      });
    });
  });
});
