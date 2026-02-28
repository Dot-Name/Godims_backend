import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  serviceCategory: {
    type: String,
    enum: ["DOMAIN", "HOSTING", "MAINTENANCE"],
    required: true
  },

  expiryDateSnapshot: {
    type: Date,
    required: true
  },

  type: {
    type: String,
    enum: [
      "EXPIRY_7_DAYS",
      "EXPIRY_3_DAYS",
      "EXPIRY_1_DAY",
      "EXPIRED"
    ],
    required: true
  },

  channel: {
    type: String,
    enum: ["EMAIL", "SMS", "IN_APP"],
    default: "EMAIL"
  },

  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING"
  },

  sentAt: Date

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);