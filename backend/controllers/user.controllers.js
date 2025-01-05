import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { comparePassword, hashPassword } from "../utils/pass/pass.js";

const getUserProfile = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile func", error.message);
    res.status(500).json({ error: error.message });
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ message: "User not found" });
    }

    if (id === req.user._id) {
      return res
        .status(400)
        .json({ message: "You can not follow / unfollow yourself" });
    }

    const user = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    const isFollowing = currentUser.followings.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            followings: id,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            followers: req.user._id,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            followings: id,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      await User.findByIdAndUpdate(
        id,
        {
          $push: {
            followers: req.user._id,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // send notification to user

      await Notification.create({
        from: req.user._id,
        to: id,
        type: "follow",
      });

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnFollowUser func", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: [...user.followings, req.user._id],
          },
        },
      },
      {
        $sample: {
          size: 4,
        },
      },
      { $project: { password: 0 } },
    ]);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUser func", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let {
      fullName,
      email,
      userName,
      currentPassword,
      newPassword,
      bio,
      link,
      profileImage,
      coverImage,
    } = req.body;

    let user = await User.findById(userId);
    let password = user.password;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      (newPassword && !currentPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res.status(400).json({
        error: "Please fill all the password blanks",
      });
    }

    if (currentPassword && newPassword) {
      const matchPassword = await comparePassword(currentPassword, password);
      if (!matchPassword) {
        return res.status(400).json({ error: "Passwords are incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Passwords should be min 6 character" });
      }

      password = await hashPassword(newPassword);
    }

    if (profileImage) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      const uploadResult = await cloudinary.uploader
        .upload(profileImage)
        .catch((error) => {
          console.log(error);
        });
      profileImage = uploadResult.secure_url;
    } else {
      profileImage = user.profileImage; // eski profil resmi kalacak
    }

    if (coverImage) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }
      const uploadResult = await cloudinary.uploader
        .upload(coverImage)
        .catch((error) => {
          console.log(error);
        });
      coverImage = uploadResult.secure_url;
    } else {
      coverImage = user.coverImage; // eski profil resmi kalacak
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        fullName,
        email,
        userName,
        password,
        bio,
        link,
        profileImage,
        coverImage,
      },
      { new: true, runValidators: true }
    );

    const { password: _, ...rest } = updatedUser._doc;

    return res.status(200).json(rest);
  } catch (error) {
    console.log("Error in updateUser func", error.message);
    res.status(500).json({ error: error.message });
  }
};

export { getUserProfile, followUnFollowUser, getSuggestedUser, updateUser };
