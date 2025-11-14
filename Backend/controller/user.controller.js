







import { hash } from "bcrypt";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../routes/config.js";

// ✅ SIGNUP CONTROLLER
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // check existing user
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please login." });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    // generate token (auto login)
    const token = jwt.sign({ id: newUser._id }, config.JWT_USER_PASSWORD, { expiresIn: "1d" });

    // cookie setup
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    res.cookie("jwt", token, cookieOptions);

    // success response
    return res.status(201).json({
      success: true,
      message: "Signup successful! Logged in automatically.",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(500).json({ success: false, message: "Error in signup." });
  }
};

// ✅ LOGIN CONTROLLER
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, { expiresIn: "1d" });

    // cookie setup
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    res.cookie("jwt", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({ success: false, message: "Error in login." });
  }
};

// ✅ LOGOUT CONTROLLER
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ success: false, message: "Error in logout." });
  }
};
