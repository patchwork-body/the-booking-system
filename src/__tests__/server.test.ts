import supertest from "supertest";
import { describe, it, expect } from "vitest";
import { createServer } from "../server";

describe("server", () => {
  it("return empty array", async () => {
    await supertest(createServer())
      .get("/v1/properties")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual([]);
      });
  });
});
