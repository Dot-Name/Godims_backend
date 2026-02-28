import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const text = `
New Contact Message:

Name: ${name}
Email: ${email}

Message:
${message}
`;

    await sendEmail(
      "info@godims.in",
      "New Contact Form Message - Godims",
      text
    );

    res.status(200).json({ message: "Message sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;