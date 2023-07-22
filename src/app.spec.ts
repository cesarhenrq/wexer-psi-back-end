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

  let idPatient: string;

  let idTimeline: string;

  let idOccurrence: string;

  let idOccurrenceWithFiles: string;

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

    const id = "64b99eff6b37ba75f3ed04fb";

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
              "./../uploads/1689717097651-1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
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
              "./../uploads/1689717097651-1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
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
          .get(`/users/${id}/patients`)
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

  describe("Patient routes", () => {
    const route = "/patients";

    describe("POST /patients", () => {
      const user = "64b99eff6b37ba75f3ed04fb";

      it("Should be able to create a new patient", async () => {
        const patient = {
          user,
          name: "test",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        idPatient = response.body.data._id;

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("contact");
        expect(response.body.data).toHaveProperty("birthdate");
        expect(response.body.data).toHaveProperty("demands");
        expect(response.body.data).toHaveProperty("personalAnnotations");
        expect(response.body.data).toHaveProperty("timelines");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Patient created");
      });

      it("Should not be able to create a new patient if user does not exists", async () => {
        const patient = {
          user: "64a246513868f467cc57585e",
          name: "test",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(patient);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("User not found");
      });

      it("Should not be able to create a new patient if token is not provided", async () => {
        const patient = {
          user,
          name: "test",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .send(patient);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not be able to create a new patient if token is not valid", async () => {
        const patient = {
          user,
          name: "test",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .set("Authorization", `Bearer ${token}1`)
          .send(patient);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });

      it("Should not be able to create a new patient if name is not provided", async () => {
        const patient = {
          user,
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["name is a required field"]);
      });

      it("Should not be able to create a new patient if contact is not provided", async () => {
        const patient = {
          user,
          name: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["contact is a required field"]);
      });

      it("Should not be able to create a new patient if birthdate is not provided", async () => {
        const patient = {
          user,
          name: "test",
          contact: "test",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual([
          "birthdate is a required field",
        ]);
      });

      it("Should not be able to create a new patient if birthdate is not valid", async () => {
        const patient = {
          user,
          name: "test",
          contact: "test",
          birthdate: "test",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .post(route)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual([
          'birthdate must be a `date` type, but the final value was: `Invalid Date` (cast from the value `"test"`).',
        ]);
      });
    });

    describe("GET /patients/:id", () => {
      it("Should find a patient by id", async () => {
        const response = await request(app)
          .get(`${route}/${idPatient}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("contact");
        expect(response.body.data).toHaveProperty("birthdate");
        expect(response.body.data).toHaveProperty("demands");
        expect(response.body.data).toHaveProperty("personalAnnotations");
        expect(response.body.data).toHaveProperty("timelines");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Patient found");
      });

      it("Should not find a patient if id is not valid", async () => {
        const response = await request(app)
          .get(`${route}/1`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not find a patient if id is not found", async () => {
        const response = await request(app)
          .get(`${route}/64a246513868f467cc60555e`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Patient not found");
      });

      it("Should not find a patient if token is not provided", async () => {
        const response = await request(app).get(`${route}/${idPatient}`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not find a patient if token is not valid", async () => {
        const response = await request(app)
          .get(`${route}/${idPatient}`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("PATCH /patients/:id", () => {
      it("Should update a patient", async () => {
        const patient = {
          name: "test2",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .patch(`${route}/${idPatient}`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("contact");
        expect(response.body.data).toHaveProperty("birthdate");
        expect(response.body.data).toHaveProperty("demands");
        expect(response.body.data).toHaveProperty("personalAnnotations");
        expect(response.body.data).toHaveProperty("timelines");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data.name).toBe(patient.name);
        expect(response.body.message).toBe("Patient updated");
      });

      it("Should not update a patient if id is not valid", async () => {
        const patient = {
          name: "test2",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .patch(`${route}/1`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not update a patient if id is not found", async () => {
        const patient = {
          name: "test2",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .patch(`${route}/64a246513868f467cc60555e`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(patient);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Patient not found");
      });

      it("Should not update a patient if token is not provided", async () => {
        const patient = {
          name: "test2",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .patch(`${route}/${idPatient}`)
          .type("json")
          .send(patient);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not update a patient if token is not valid", async () => {
        const patient = {
          name: "test2",
          contact: "test",
          birthdate: "1999-01-01",
          demands: "test",
          personalAnnotations: "test",
        };

        const response = await request(app)
          .patch(`${route}/${idPatient}`)
          .type("json")
          .set("Authorization", `Bearer ${token}1`)
          .send(patient);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("GET /patients/:id/timelines", () => {
      it("Should list all timelines of a patient", async () => {
        const response = await request(app)
          .get(`${route}/${idPatient}/timelines`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeLessThanOrEqual(10);
        expect(response.body.message).toBe("Patient timelines found");
      });

      it("Should not list all timelines of a patient if id is not valid", async () => {
        const response = await request(app)
          .get(`${route}/1/timelines`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not list all timelines of a patient if id is not found", async () => {
        const response = await request(app)
          .get(`${route}/64a246513868f467cc60555e/timelines`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Patient not found");
      });

      it("Should not list all timelines of a patient if token is not provided", async () => {
        const response = await request(app).get(
          `${route}/${idPatient}/timelines`
        );

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not list all timelines of a patient if token is not valid", async () => {
        const response = await request(app)
          .get(`${route}/${idPatient}/timelines`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });
  });

  describe("Timeline routes", () => {
    const route = "/timelines";

    describe("POST /timelines/:patientId", () => {
      it("Should create a timeline", async () => {
        const timeline = {
          name: "test",
        };

        const response = await request(app)
          .post(`${route}/${idPatient}`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        idTimeline = response.body.data._id;

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("occurrences");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data.name).toBe(timeline.name);
        expect(response.body.message).toBe("Timeline created");
      });

      it("Should not create a timeline if name is not provided", async () => {
        const timeline = {};

        const response = await request(app)
          .post(`${route}/${idPatient}`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["name is a required field"]);
      });

      it("Should not create a timeline if patientId is not valid", async () => {
        const timeline = {
          name: "test",
        };

        const response = await request(app)
          .post(`${route}/1`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not create a timeline if patientId is not found", async () => {
        const timeline = {
          name: "test",
        };

        const response = await request(app)
          .post(`${route}/64a246513868f467cc60555e`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Patient not found");
      });

      it("Should not create a timeline if token is not provided", async () => {
        const timeline = {
          name: "test",
        };

        const response = await request(app)
          .post(`${route}/${idPatient}`)
          .type("json")
          .send(timeline);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not create a timeline if token is not valid", async () => {
        const timeline = {
          name: "test",
        };

        const response = await request(app)
          .post(`${route}/${idPatient}`)
          .type("json")
          .set("Authorization", `Bearer ${token}1`)
          .send(timeline);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("GET /timelines/:id", () => {
      it("Should find a timeline by id", async () => {
        const response = await request(app)
          .get(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("occurrences");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Timeline found");
      });

      it("Should not find a timeline by id if id is not valid", async () => {
        const response = await request(app)
          .get(`${route}/1`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not find a timeline by id if id is not found", async () => {
        const response = await request(app)
          .get(`${route}/64a246513868f467cc60555e`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Timeline not found");
      });

      it("Should not find a timeline by id if token is not provided", async () => {
        const response = await request(app).get(`${route}/${idTimeline}`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not find a timeline by id if token is not valid", async () => {
        const response = await request(app)
          .get(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("PATCH /timelines/:id", () => {
      it("Should update a timeline by id", async () => {
        const timeline = {
          name: "test2",
        };

        const response = await request(app)
          .patch(`${route}/${idTimeline}`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("occurrences");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.data.name).toBe(timeline.name);
        expect(response.body.message).toBe("Timeline updated");
      });

      it("Should not update a timeline by id if id is not valid", async () => {
        const timeline = {
          name: "test2",
        };

        const response = await request(app)
          .patch(`${route}/1`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not update a timeline by id if id is not found", async () => {
        const timeline = {
          name: "test2",
        };

        const response = await request(app)
          .patch(`${route}/64a246513868f467cc60555e`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(timeline);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Timeline not found");
      });

      it("Should not update a timeline by id if token is not provided", async () => {
        const timeline = {
          name: "test2",
        };

        const response = await request(app)
          .patch(`${route}/${idTimeline}`)
          .type("json")
          .send(timeline);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not update a timeline by id if token is not valid", async () => {
        const timeline = {
          name: "test2",
        };

        const response = await request(app)
          .patch(`${route}/${idTimeline}`)
          .type("json")
          .set("Authorization", `Bearer ${token}1`)
          .send(timeline);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("GET /timelines/:id/occurrences", () => {
      it("Should find all occurrences of a timeline by id", async () => {
        const response = await request(app)
          .get(`${route}/${idTimeline}/occurrences`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeLessThanOrEqual(10);
        expect(response.body.message).toBe("Occurrences found");
      });

      it("Should not find all occurrences of a timeline by id if id is not valid", async () => {
        const response = await request(app)
          .get(`${route}/1/occurrences`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not find all occurrences of a timeline by id if id is not found", async () => {
        const response = await request(app)
          .get(`${route}/64a246513868f467cc60555e/occurrences`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Timeline not found");
      });

      it("Should not find all occurrences of a timeline by id if token is not provided", async () => {
        const response = await request(app).get(
          `${route}/${idTimeline}/occurrences`
        );

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not find all occurrences of a timeline by id if token is not valid", async () => {
        const response = await request(app)
          .get(`${route}/${idTimeline}/occurrences`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });
  });

  describe("Occurrence routes", () => {
    const route = "/occurrences";

    describe("POST /occurrences/:timelineId", () => {
      it("Should be able to create an occurrence without files", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        idOccurrence = response.body.data._id;

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
      });

      it("Should be able to create an occurrence with files", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`)
          .field("name", occurrence.name)
          .field("content", occurrence.content)
          .field("kind", occurrence.kind)
          .attach(
            "files",
            path.resolve(
              __dirname,
              "./../uploads/1689717097651-1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
            )
          )
          .attach(
            "files",
            path.resolve(
              __dirname,
              "./../uploads/1689717097651-1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
            )
          );

        idOccurrenceWithFiles = response.body.data._id;

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
        expect(response.body.data.files.length).toBe(2);
      });

      it("Should not create an occurrence if name is not provided", async () => {
        const occurrence = {
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["name is a required field"]);
      });

      it("Should not create an occurrence if content is not provided", async () => {
        const occurrence = {
          name: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["content is a required field"]);
      });

      it("Should not create an occurrence if kind is not provided", async () => {
        const occurrence = {
          name: "test",
          content: "test",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual(["kind is a required field"]);
      });

      it("Should not create an occurrence if kind is not valid", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "test",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(400);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toEqual([
          "kind must be one of the following values: session, relevant-fact",
        ]);
      });

      it("Should not create an occurrence if timeline id is not valid", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/1`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not create an occurrence if timeline id is not found", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/64a246513868f467cc60555e`)
          .type("json")
          .set("Authorization", `Bearer ${token}`)
          .send(occurrence);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Timeline not found");
      });

      it("Should not create an occurrence if token is not provided", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not create an occurrence if token is not valid", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .post(`${route}/${idTimeline}`)
          .type("json")
          .set("Authorization", `Bearer ${token}1`)
          .send(occurrence);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("GET /occurrences/:id", () => {
      it("Should be able to get an occurrence by id", async () => {
        const response = await request(app)
          .get(`${route}/${idOccurrence}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
      });

      it("Should not get an occurrence if id is not valid", async () => {
        const response = await request(app)
          .get(`${route}/1`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not get an occurrence if id is not found", async () => {
        const response = await request(app)
          .get(`${route}/64a246513868f467cc60555e`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Occurrence not found");
      });

      it("Should not get an occurrence if token is not provided", async () => {
        const response = await request(app).get(`${route}/${idOccurrence}`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not get an occurrence if token is not valid", async () => {
        const response = await request(app)
          .get(`${route}/${idOccurrence}`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("PATCH /occurrences/:id", () => {
      it("Should be able to update an occurrence", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .patch(`${route}/${idOccurrence}`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
        expect(response.body.message).toBe("Occurrence updated successfully");
      });

      it("Should be able to update occurrence's files", async () => {
        const response = await request(app)
          .patch(`${route}/${idOccurrenceWithFiles}`)
          .set("Authorization", `Bearer ${token}`)
          .attach(
            "files",
            path.resolve(
              __dirname,
              "./../uploads/1689717097651-1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
            )
          )
          .attach(
            "files",
            path.resolve(
              __dirname,
              "./../uploads/1689717097651-1688423668943-flor-rosa-sobre-um-fundo-branco.jpg"
            )
          );

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
        expect(response.body.message).toBe("Occurrence updated successfully");
      });

      it("Should not update an occurrence if id is not valid", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .patch(`${route}/1`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not update an occurrence if id is not found", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .get(`${route}/64a246513868f467cc60555e`)
          .set("Authorization", `Bearer ${token}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Occurrence not found");
      });

      it("Should not update an occurrence if token is not provided", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .patch(`${route}/${idOccurrence}`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not update an occurrence if token is not valid", async () => {
        const occurrence = {
          name: "test",
          content: "test",
          kind: "session",
        };

        const response = await request(app)
          .patch(`${route}/${idOccurrence}`)
          .set("Authorization", `Bearer ${token}1`)
          .type("json")
          .send(occurrence);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });

    describe("DELETE /occurrences/:id/timelines/:timelineId", () => {
      it("Should be able to delete an occurrence", async () => {
        const response = await request(app)
          .delete(`${route}/${idOccurrence}/timelines/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Occurrence deleted successfully");
      });

      it("Should be able to delete an occurrence with its files", async () => {
        const response = await request(app)
          .delete(`${route}/${idOccurrenceWithFiles}/timelines/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("content");
        expect(response.body.data).toHaveProperty("kind");
        expect(response.body.data).toHaveProperty("files");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Occurrence deleted successfully");
      });

      it("Should not delete an occurrence if id is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/1/timelines/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not delete an occurrence if id is not found", async () => {
        const response = await request(app)
          .delete(`${route}/64a246513868f467cc60555e/timelines/${idTimeline}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Occurrence not found");
      });

      it("Should not delete an occurrence if token is not provided", async () => {
        const response = await request(app).delete(
          `${route}/${idOccurrence}/timelines/${idTimeline}`
        );

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not delete an occurrence if token is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/${idOccurrence}/timelines/${idTimeline}`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });
  });

  describe("Timeline route", () => {
    const route = "/timelines";

    describe("DELETE /timelines/:id/patients/:patientsId", () => {
      it("Should delete a timeline by id", async () => {
        const response = await request(app)
          .delete(`${route}/${idTimeline}/patients/${idPatient}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("occurrences");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Timeline deleted");
      });

      it("Should not delete a timeline by id if id is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/1/patients/${idPatient}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not delete a timeline by id if id is not found", async () => {
        const response = await request(app)
          .delete(`${route}/64a246513868f467cc60555e/patients/${idPatient}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Timeline not found");
      });

      it("Should not delete a timeline by id if token is not provided", async () => {
        const response = await request(app).delete(
          `${route}/${idTimeline}/patients/${idPatient}`
        );

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not delete a timeline by id if token is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/${idTimeline}/patients/${idPatient}`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });

      it("Should not delete a timeline by id if patientId is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/${idTimeline}/patients/1`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not delete a timeline by id if patientId is not found", async () => {
        const response = await request(app)
          .delete(`${route}/${idTimeline}/patients/64a246513868f467cc60555e`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Patient not found");
      });
    });
  });

  describe("Patient route", () => {
    const route = "/patients";

    describe("DELETE /patients/:id", () => {
      it("Should delete a patient by id", async () => {
        const response = await request(app)
          .delete(`${route}/${idPatient}`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("_id");
        expect(response.body.data).toHaveProperty("name");
        expect(response.body.data).toHaveProperty("contact");
        expect(response.body.data).toHaveProperty("birthdate");
        expect(response.body.data).toHaveProperty("timelines");
        expect(response.body.data).toHaveProperty("demands");
        expect(response.body.data).toHaveProperty("personalAnnotations");
        expect(response.body.data).toHaveProperty("createdAt");
        expect(response.body.data).toHaveProperty("updatedAt");
        expect(response.body.message).toBe("Patient deleted");
      });

      it("Should not delete a patient by id if id is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/1`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Internal server error");
      });

      it("Should not delete a patient by id if id is not found", async () => {
        const response = await request(app)
          .delete(`${route}/64a246513868f467cc60555e`)
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Patient not found");
      });

      it("Should not delete a patient by id if token is not provided", async () => {
        const response = await request(app).delete(`${route}/${idPatient}`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Token not found!");
      });

      it("Should not delete a patient by id if token is not valid", async () => {
        const response = await request(app)
          .delete(`${route}/${idPatient}`)
          .set("Authorization", `Bearer ${token}1`);

        expect(response.status).toBe(401);
        expect(response.body.data).toBeNull();
        expect(response.body.message).toBe("Invalid token!");
      });
    });
  });
});
