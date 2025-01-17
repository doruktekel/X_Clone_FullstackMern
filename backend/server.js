import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import notificationRouter from "./routes/notification.routes.js";

import { envVariables } from "./utils/env/envVariables.js";
import { connectDatabase } from "./database/connectDatabase.js";

cloudinary.config({
  cloud_name: envVariables.CLOUDINARY_CLOUD_NAME,
  api_key: envVariables.CLOUDINARY_API_KEY,
  api_secret: envVariables.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = envVariables.PORT || 4005;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/notification", notificationRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, (req, res) => {
  try {
    connectDatabase();
    console.log(`Server is listening port : ${PORT} `);
  } catch (error) {
    console.log("Listening port error", error);
  }
});
