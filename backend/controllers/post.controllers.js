import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";

const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    let img;

    if (!text && !image) {
      return res.status(400).json("Image or text should be");
    }

    if (image) {
      const imageInfo = await cloudinary.uploader.upload(image);
      img = imageInfo.secure_url;
    }

    const newPost = await Post.create({
      user: req.user._id,
      text: text,
      image: img,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost func", error.message);
    res.status(500).json("Internal server error");
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 1 st way

    // if (req.user._id.toString() !== post.user.toString()) {
    //   return res.status(403).json("You can just delete your posts");
    // }

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ error: "You can just delete your posts" });
    }

    // 2 nd way

    if (post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);

      // bunuda dene ?
      //    await cloudinary.v2.uploader.destroy(post.image.public_id);
    }

    const deletedPost = await Post.findByIdAndDelete(post._id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost func", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;

    if (!text) {
      return res.status(400).json("You should write something");
    }

    const post = await Post.findById(id);

    if (post.user.equals(req.user._id)) {
      return res.status(403).json("You can not comment your posts");
    }

    const comment = {
      user: req.user._id,
      text,
    };

    const newComment = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: comment,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(newComment);
  } catch (error) {
    console.log("Error in commentPost func", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    let newPost;

    if (post.user.equals(req.user._id)) {
      return res.status(403).json("You can not like/unlike your posts");
    }

    const liked = post.likes.includes(req.user._id);

    if (liked) {
      newPost = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likes: req.user._id },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { likedPosts: id },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      newPost = await Post.findByIdAndUpdate(
        id,
        {
          $push: { likes: req.user._id },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { likedPosts: id },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await Notification.create({
        from: req.user._id,
        to: post.user,
        type: "like",
      });
    }

    res.status(200).json(newPost);
  } catch (error) {
    console.log("Error in commentPost func", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // sorting to last one
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    if (posts.length === 0) {
      return res.status(404).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts func", error.message);
    res.status(500).json("Internal server error");
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts func", error.message);
    res.status(500).json("Internal server error");
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    const followedPosts = await Post.find({
      user: { $in: user.followings },
    })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json(followedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts func", error.message);
    res.status(500).json("Internal server error");
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ userName: username });

    if (!user) {
      return res.status(404).json("User not found");
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts func", error.message);
    res.status(500).json("Internal server error");
  }
};

export {
  getAllPosts,
  createPost,
  deletePost,
  commentPost,
  likeUnlikePost,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
};
