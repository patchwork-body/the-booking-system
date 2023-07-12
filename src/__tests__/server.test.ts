import supertest from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../app";

describe("server", () => {
  it("return empty array", async () => {
    await supertest(createApp())
      .get("/v1/properties")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual([]);
      });
  });
});
