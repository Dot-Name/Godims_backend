import Notification from "../models/Notification.js";
import Service from "../models/service.js";

const getDaysLeft = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const checkAndSend = async (service, expiryDate, category) => {
  if (!expiryDate) return;

  const daysLeft = getDaysLeft(expiryDate);

  let notificationType = null;

  if (daysLeft === 7) notificationType = "EXPIRY_7_DAYS";
  if (daysLeft === 3) notificationType = "EXPIRY_3_DAYS";
  if (daysLeft === 1) notificationType = "EXPIRY_1_DAY";
  if (daysLeft === 0) notificationType = "EXPIRED";

  if (!notificationType) return;

  // 🔎 Check if already sent
  const alreadySent = await Notification.findOne({
    serviceId: service._id,
    serviceCategory: category,
    type: notificationType,
    expiryDateSnapshot: expiryDate
  });

  if (alreadySent) return; // 🚫 prevents spam

  // 📧 Send Email
  await sendEmail(
    service.user.email,
    "Service Expiry Reminder - Godims",
    `
Hello ${service.user.name},

Your ${category} service is expiring soon.

Project: ${service.projectType}
Details: ${service.projectDetails}

Please renew soon.

- Godims Team
`
  );

  // 📝 Log Notification
  await Notification.create({
    userId: service.user._id,
    serviceId: service._id,
    serviceCategory: category,
    expiryDateSnapshot: expiryDate,
    type: notificationType,
    status: "SENT",
    sentAt: new Date()
  });
};



const startExpiryCron = async () => {
  try {
    const services = await Service.find().populate("user");

    for (const service of services) {
      await checkAndSend(service, service.domainExpiryDate, "DOMAIN");
      await checkAndSend(service, service.hostingExpiryDate, "HOSTING");
      await checkAndSend(service, service.maintenanceExpiryDate, "MAINTENANCE");
    }

    console.log("Expiry check completed");
  } catch (error) {
    console.error("Expiry Reminder Error:", error);
  }
};

export default startExpiryCron;
