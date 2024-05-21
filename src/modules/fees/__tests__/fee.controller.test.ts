import request from "supertest";
import express from "express";
import { fetchEvents, getEvents } from "../fees.controller";
import * as feesService from "../fees.service";

const app = express();
app.use(express.json());

app.post("/api/fees/fetch-events", fetchEvents);
app.get("/api/fees/events/:integrator", getEvents);

jest.mock("../fees.service");

describe("Fees Controller", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("POST /api/fees/fetch-events", () => {
    it("should fetch and store events successfully", async () => {
      (feesService.fetchAndStoreFeeEvents as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post("/api/fees/fetch-events")
        .send({ fromBlock: 100, toBlock: 200 });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Events fetched and stored successfully");
    });

    it("should return 500 if there is an error", async () => {
      (feesService.fetchAndStoreFeeEvents as jest.Mock).mockRejectedValueOnce(new Error("Something went wrong"));

      const response = await request(app)
        .post("/api/fees/fetch-events")
        .send({ fromBlock: 100, toBlock: 200 });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Something went wrong");
    });

    it("should return 500 with unknown error message if there is an unknown error", async () => {
      (feesService.fetchAndStoreFeeEvents as jest.Mock).mockRejectedValueOnce("Unknown error");

      const response = await request(app)
        .post("/api/fees/fetch-events")
        .send({ fromBlock: 100, toBlock: 200 });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Unknown error occurred while fetching events");
    });
  });

  describe("GET /api/fees/events/:integrator", () => {
    it("should return events for the integrator", async () => {
      const mockEvents = [
        { token: "0xTokenAddress", integrator: "0xIntegratorAddress", integratorFee: "1000", lifiFee: "2000", blockNumber: 123456 },
      ];
      (feesService.retrieveEventsForIntegrator as jest.Mock).mockResolvedValueOnce(mockEvents);

      const response = await request(app)
        .get("/api/fees/events/0xIntegratorAddress")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
    });

    it("should return 500 if there is an error", async () => {
      (feesService.retrieveEventsForIntegrator as jest.Mock).mockRejectedValueOnce(new Error("Something went wrong"));

      const response = await request(app)
        .get("/api/fees/events/0xIntegratorAddress")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Something went wrong");
    });

    it("should return 500 with unknown error message if there is an unknown error", async () => {
      (feesService.retrieveEventsForIntegrator as jest.Mock).mockRejectedValueOnce("Unknown error");

      const response = await request(app)
        .get("/api/fees/events/0xIntegratorAddress")
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(500);
      expect(response.text).toBe("Unknown error occurred while getting events for integrator");
    });
  });
});
