import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
// import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  createService,
  updateService,
  getUserServices,
  deleteUser,
  deleteService,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.get("/services/:userId", getUserServices);
router.delete("/users/:id", deleteUser);
router.delete("/services/:id", deleteService);

export default router;