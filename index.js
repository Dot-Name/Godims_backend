import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
// import startExpiryCron from "./utils/expiryReminder.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = process.env.CLIENT_URLS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);
app.use(morgan("dev"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api", contactRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to GoDIMS API");
});

// Start Cron Job for Expiry Reminders
// startExpiryCron();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
