import User from "../models/User.js";
import Service from "../models/service.js";

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// POST /api/admin/services
export const createService = async (req, res) => {
  try {
    const {
      userId,
      domainStartDate,
      domainExpiryDate,
      hostingExpiryDate,
      maintenanceExpiryDate,
      projectType,
      projectDetails,
    } = req.body;

    const service = await Service.create({
      user: userId,
      domainStartDate,
      domainExpiryDate,
      hostingExpiryDate,
      maintenanceExpiryDate,
      projectType,
      projectDetails,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: "Service creation failed" });
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// PUT /api/admin/services/:id
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      message: "Service updated",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// GET /api/admin/services/:userId
export const getUserServices = async (req, res) => {
  try {
    const services = await Service.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all services of that user first
    await Service.deleteMany({ user: user._id });

    await user.deleteOne();

    res.json({ message: "User and related services deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User deletion failed" });
  }
};

// DELETE /api/admin/services/:id
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.deleteOne();

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Service deletion failed" });
  }
};