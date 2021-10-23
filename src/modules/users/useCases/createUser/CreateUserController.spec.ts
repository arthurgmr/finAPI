import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";

let connection: Connection;
describe("Create User", () => {

    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();
    });

    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close();
    });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "usertest@finapi.com",
      password: "123456"
    });

    expect(response.status).toBe(201)
  });
});
