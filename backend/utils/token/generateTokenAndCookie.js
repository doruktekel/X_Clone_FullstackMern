import jwt from "jsonwebtoken";
import { envVariables } from "../env/envVariables.js";

export const generateTokenAndCookie = (id, res) => {
  const token = jwt.sign({ id }, envVariables.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });

  res.cookie("x_clone_token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: envVariables.NODE_ENV !== "development",
  });
};
