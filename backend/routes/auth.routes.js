import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/getMe", protectRoute, getMe);

export default router;
