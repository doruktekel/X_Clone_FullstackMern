import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  followUnFollowUser,
  getSuggestedUser,
  getUserProfile,
  updateUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/update", protectRoute, updateUser);

export default router;
