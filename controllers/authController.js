import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 Google Login
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by Google" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profilePic: picture,
      });
    }

    const accessToken = generateToken(user);

    // res.cookie("token", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   // sameSite: "strict",
    //   sameSite: "lax",
    //   // sameSite: "none",
    //   maxAge: 15 * 60 * 1000,
    // });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    }); 

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(400).json({ message: "Google authentication failed" });
  }
};

// 🔐 Get Current User
export const getMe = (req, res) => {
  res.json({ message: "Welcome User", user: req.user });
};

// 🔓 Logout
export const logoutUser = (req, res) => {
  // res.clearCookie("token");
  // res.clearCookie("token", {
  //   httpOnly: true,
  //   // sameSite: "none",
  //   sameSite: "lax",
  //   secure: false,
  // });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.json({ message: "Logged out successfully" });
};

// 📩 Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return res.status(400).json({ message: "OTP already sent. Try later." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    await sendEmail(
      email,
      "Your OTP - Godims",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: email.split("@")[0],
        email,
      });
    }

    const accessToken = generateToken(user);

    // res.cookie("token", accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   // sameSite: "strict",
    //   sameSite: "lax",
    //   // sameSite: "none",
    //   maxAge: 15 * 60 * 1000,
    // });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    await Otp.deleteMany({ email });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

