import mongoose from "mongoose";    

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
    },

    organization: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profilePic: String,
    isGoogleUser: {
      type: Boolean,
      default: true,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;