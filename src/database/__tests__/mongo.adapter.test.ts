import { MongoDBAdapter } from "../../database/mongo.adapter";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("MongoDBAdapter", () => {
  let mongoServer: MongoMemoryServer;
  let mongoDBAdapter: MongoDBAdapter;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mongoDBAdapter = MongoDBAdapter.getInstance();
    await mongoDBAdapter.connect(uri);
  });

  afterAll(async () => {
    await mongoDBAdapter.disconnect();
    await mongoServer.stop();
  });

  it("should connect to MongoDB", async () => {
    expect(mongoDBAdapter.isConnected()).toBe(true);
  });

  it("should disconnect from MongoDB", async () => {
    await mongoDBAdapter.disconnect();
    expect(mongoDBAdapter.isConnected()).toBe(false);
  });

  // It should trigger error MongoDB connection error if try connect with wrong URI
  it("should trigger error MongoDB connection error", async () => {
    const wrongUri = "mongod://localhost:27017/wrong";
    await expect(mongoDBAdapter.connect(wrongUri)).rejects.toThrow("MongoDB connection error");
  });
});
