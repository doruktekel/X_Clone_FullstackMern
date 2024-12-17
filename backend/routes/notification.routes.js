import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  deleteAllNotifications,
  getAllNotifications,
} from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getAllNotifications);
router.delete("/", protectRoute, deleteAllNotifications);

export default router;
