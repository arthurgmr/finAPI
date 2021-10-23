import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";


let connection: Connection;
describe("Show Statement", () => {
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();

      const id = uuidV4();
      const password = await hash("12345", 8);

      await connection.query(`
        INSERT INTO users(id, name, email, password, created_at)
        VALUES('${id}', 'userTest', 'userTest@finapi.com.br', '${password}', 'now()')
      `);
    });

    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close();
    });

    it("Should be able to show a statement", async () => {
      const responseToken = await request(app).post("/api/v1/sessions").send({
        email: "userTest@finapi.com.br",
        password: "12345"
      });

      const { token } = responseToken.body;

      const statement = await request(app).post("/api/v1/statements/deposit")
        .send({
          amount: 150,
          description: "Test Deposit"
        })
        .set({
          Authorization: `Bearer ${token}`
        });

      const response = await request(app)
        .get(`/api/v1/statements/${statement.body.id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(response.body.id).toEqual(statement.body.id);
      expect(response.status).toBe(200);
    });


});
