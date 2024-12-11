import mongoose from "mongoose";
import { envVariables } from "../utils/env/envVariables.js";

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(envVariables.MONGO_URI);
    console.log(
      "Database connected successfully",
      `Host :${conn.connection.host} `,
      `Name :${conn.connection.name} `,
      `Port :${conn.connection.port} `
    );
  } catch (error) {
    console.log("Database connection error", error.message);
    process.exit(1);
  }
};
