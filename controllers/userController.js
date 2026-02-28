import User from "../models/User.js";
import Service from "../models/service.js";

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try{
    res.json(req.user);
  }
  catch(error){
    res.status(500).json({ message: "Failed to fetch profile" });
    console.error("Get Profile Error:", error);
    console.error("User Data:", req.user);
    console.log("Request Headers:", req.headers);
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { email, mobile, organization } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (mobile !== undefined) user.mobile = mobile;
    if (organization !== undefined) user.organization = organization;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// GET /api/user/services
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({
      user: req.user._id,
      isVisible: true,
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};