import app from "./app";

import path from "path";

import { disconnect } from "mongoose";

import request from "supertest";

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await disconnect();
  });

  let token: string;

  describe("Auth routes", () => {
    describe("POST /auth", () => {
      const route = "/auth";

      it("Should be able to authenticate an user", async () => {
        const user = {
          email: "cesar@gmail.com",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        token = response.body.data.token;

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

  describe("User routes", () => {
    const route = "/users";

    const id = "64a246513868f467cc57555e";

    let idToDelete: string;

    describe("POST /users", () => {
      it("Should be able to create an user with image", async () => {
        const user = {
          name: "test",
          email: `test${new Date().getTime()}@gmail.com`,
          password: "123456",
        };

        const response = await request(app)
          .post(route)
          .attach(
            "image",
            path.resolve(
              __dirname,
              "./../uploads/1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
            )
          )
          .field("name", user.name)
          .field("email", user.email)
          .field("password", user.password);

        idToDelete = response.body.data._id;

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("image");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("email");
        expect(response.body.data).toHaveProperty("password");
        expect(response.body.data).toHaveProperty("patients");
        expect(response.body.message).toBe("User created successfully");
      });

      it("Should be able to create an user without image", async () => {
        const user = {
          name: "test",
          email: `test${new Date().getTime()}@gmail.com`,
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("image");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("email");
        expect(response.body.data).toHaveProperty("password");
        expect(response.body.data).toHaveProperty("patients");
        expect(response.body.message).toBe("User created successfully");
      });

      it("Should not be able to create an user if name is not provided", async () => {
        const user = {
          email: "test@gmai.com",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["name is a required field"]);
      });

      it("Should not be able to create an user if email is not provided", async () => {
        const user = {
          name: "test",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["email is a required field"]);
      });

      it("Should not be able to create an user if email is not valid", async () => {
        const user = {
          name: "test",
          email: "test",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["email must be a valid email"]);
      });

      it("Should not be able to create an user if password is not provided", async () => {
        const user = {
          name: "test",
          email: "test@gmail.com",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["password is a required field"]);
      });

      it("Should not be able to create an user if password is not valid", async () => {
        const user = {
          name: "test",
          email: "test@gmail.com",
          password: "123",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual([
          "password must be at least 6 characters",
        ]);
      });

      it("Should not be able to create an user if user already exists", async () => {
        const user = {
          name: "test",
          email: "cesar@gmail.com",
          password: "123456",
        };

        const response = await request(app).post(route).type("json").send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("User already exists");
      });
    });

    describe("PATCH /users/:id", () => {
      it("Should be able to update an user", async () => {
        const user = {
          name: "test2",
        };

        const response = await request(app)
          .patch(`/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(user);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("image");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("email");
        expect(response.body.data).toHaveProperty("password");
        expect(response.body.data).toHaveProperty("patients");
        expect(response.body.message).toBe("User updated successfully");
        expect(response.body.data.name).toBe(user.name);
      });

      it("Should be able to update an user image", async () => {
        const response = await request(app)
          .patch(`/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .attach(
            "image",
            path.resolve(
              __dirname,
              "./../uploads/1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
            )
          );

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("image");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("email");
        expect(response.body.data).toHaveProperty("password");
        expect(response.body.data).toHaveProperty("patients");
        expect(response.body.message).toBe("User updated successfully");
      });

      it("Should not be able to update an user if email is not valid", async () => {
        const user = {
          email: "test",
        };

        const response = await request(app)
          .patch(`/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["email must be a valid email"]);
      });

      it("Should not be able to update an user if password is not valid", async () => {
        const user = {
          password: "123",
        };

        const response = await request(app)
          .patch(`/users/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send(user);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual([
          "password must be at least 6 characters",
        ]);
      });

      it("Should not be able to update an user if user does not exists", async () => {
        const user = {
          name: "test",
        };

        const response = await request(app)
          .patch(`/users/64a246513868f467cc57655e`)
          .set("Authorization", `Bearer ${token}`)
          .send(user);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("User not found");
      });

      it("Should not be able to update an user if token is not provided", async () => {
        const user = {
          name: "test",
        };

        const response = await request(app).patch(`/users/${id}`).send(user);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not be able to update an user if token is not valid", async () => {
        const user = {
          name: "test",
        };

        const response = await request(app)
          .patch(`/users/${id}`)
          .set("Authorization", `Bearer ${token}1`)
          .send(user);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("DELETE /users/:id", () => {
      it("Should be able to delete an user", async () => {
        const response = await request(app)
          .delete(`/users/${idToDelete}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("image");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("email");
        expect(response.body.data).toHaveProperty("password");
        expect(response.body.data).toHaveProperty("patients");
        expect(response.body.message).toBe("User deleted successfully");
      });

      it("Should not be able to delete an user if user does not exists", async () => {
        const response = await request(app)
          .delete(`/users/64b70c7f12ffe8bb6c4422f2`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("User not found");
      });

      it("Should not be able to delete an user if token is not provided", async () => {
        const response = await request(app).delete(
          `/users/64b70c7f12ffe8bb6c4422f2`
        );

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not be able to delete an user if token is not valid", async () => {
        const response = await request(app)
          .delete(`/users/64b70c7f12ffe8bb6c4422f2`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("GET /users/:id/patients", () => {
      it("Should be able to list all patients from an user", async () => {
        const response = await request(app)
          .get(`/users/64a246513868f467cc57555e/patients`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeLessThanOrEqual(10);
        expect(response.body.message).toBe("Patients retrieved successfully");
      });

      it("Should not be able to list all patients from an user if user does not exists", async () => {
        const response = await request(app)
          .get(`/users/64a246513868f467cc57585e/patients`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("User not found");
      });

      it("Should not be able to list all patients from an user if token is not provided", async () => {
        const response = await request(app).get(
          `/users/64a246513868f467cc57555e/patients`
        );

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not be able to list all patients from an user if token is not valid", async () => {
        const response = await request(app)
          .get(`/users/64a246513868f467cc57555e/patients`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });
  });
});
