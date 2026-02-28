import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  googleLogin,
  getMe,
  logoutUser,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/google", googleLogin);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
// router.get("/dashboard", protect, adminOnly, (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });
export default router;