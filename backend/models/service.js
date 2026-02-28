import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    domainStartDate: Date,
    domainExpiryDate: Date,

    hostingExpiryDate: Date,

    maintenanceExpiryDate: Date,

    projectType: {
      type: String,
      enum: ["WEBSITE", "MOBILE_APP"],
    },

    projectDetails: String,

    isVisible: {
      type: Boolean,
      default: true,
    },

    // expiryNotificationDates: [{type: Date}],

    // lastReminderSent: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);