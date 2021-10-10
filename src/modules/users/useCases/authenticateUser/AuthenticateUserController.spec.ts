import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";

let connection: Connection;
describe("Authenticate User", () => {

    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();

      const id = uuidV4();
      const password = await hash("12345", 8);

      await connection.query(`
        INSERT INTO users(id, name, email, password, created_at)
        VALUES('${id}', 'userTestAuth', 'userTestAuth@finapi.com.br', '${password}', 'now()')
      `);
    });

    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close();
    });

  it("Should be able to authenticate user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "userTestAuth@finapi.com.br",
      password: "12345"
    })

    expect(responseToken.status).toBe(200)
  });
});
