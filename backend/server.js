import express from "express";

import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

import { envVariables } from "./utils/env/envVariables.js";
import { connectDatabase } from "./database/connectDatabase.js";

const app = express();
const PORT = envVariables.PORT || 4005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.listen(PORT, (req, res) => {
  try {
    connectDatabase();
    console.log(`Server is listening port : ${PORT} `);
  } catch (error) {
    console.log("Listening port error", error);
  }
});
