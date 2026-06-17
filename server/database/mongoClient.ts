import mongoose from "mongoose";

const { MONGO_URL } = process.env;

mongoose
  .connect(MONGO_URL as string)
  .then(() => {
    console.info("Connected to MongoDB (logs d'activité)");
  })
  .catch((error: Error) => {
    console.warn(
      "Warning:",
      "Failed to establish a MongoDB connection.",
      "Please check MONGO_URL in your .env file if you need MongoDB access.",
    );
    console.warn(error.message);
  });
