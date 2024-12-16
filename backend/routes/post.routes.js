import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);

router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);

router.post("/comment/:id", protectRoute, commentPost);
router.post("/like/:id", protectRoute, likeUnlikePost);

router.get("/liked/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);

export default router;
