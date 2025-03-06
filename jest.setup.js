import mongoose from "mongoose";

// Connect to a test database before running tests
beforeAll(async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.disconnect();
});