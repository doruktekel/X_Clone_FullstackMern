import { User } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/pass/pass.js";
import { generateTokenAndCookie } from "../utils/token/generateTokenAndCookie.js";

const register = async (req, res) => {
  try {
    const { fullName, password, email, userName } = req.body;

    if (!fullName || !password || !email || !userName) {
      return res.status(400).json({ error: "Please fill all the blanks" });
    }

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email.trim())) {
      return res.status(400).json({ error: "Invalid Email type" });
    }

    const alreadyUsedEmail = await User.findOne({ email });
    if (alreadyUsedEmail) {
      return res.status(400).json({ error: "This Email registered before" });
    }

    const alreadyUsedUserName = await User.findOne({ userName });
    if (alreadyUsedUserName) {
      return res.status(400).json({ error: "This Username registered before" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password should min 6 character" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });

    generateTokenAndCookie(newUser._id, res);

    const { password: _, ...rest } = newUser._doc;

    res.status(201).json(rest);
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { password, userName } = req.body;

    if (!password || !userName) {
      return res.status(400).json("You should fill all the blanks");
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verify = await comparePassword(password, user.password);
    if (!verify) {
      return res.status(400).json({ error: "Credentials are wrong" });
    }

    generateTokenAndCookie(user._id, res);

    const { password: _, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res
      .clearCookie("x_clone_token")
      .status(200)
      .json({ message: "Logout successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { register, login, logout, getMe };
