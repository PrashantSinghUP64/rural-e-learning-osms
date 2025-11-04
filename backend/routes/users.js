const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get("/", auth, authorize("admin"), async (req, res) => {
  try {
    const { role, grade, subject, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (grade) query.grade = grade;
    if (subject) query.subjects = { $in: [subject] };

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/students
// @desc    Get all students
// @access  Private (Teachers, Parents, Admin)
router.get("/students", auth, authorize("teacher", "parent", "admin"), async (req, res) => {
  try {
    const { grade, subject, page = 1, limit = 20 } = req.query;
    const query = { role: "student", isActive: true };

    if (grade) query.grade = grade;
    if (subject) query.subjects = { $in: [subject] };

    const students = await User.find(query)
      .select("-password")
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/teachers
// @desc    Get all teachers
// @access  Private
router.get("/teachers", auth, async (req, res) => {
  try {
    const { subject, page = 1, limit = 20 } = req.query;
    const query = { role: "teacher", isActive: true };

    if (subject) query.subjects_taught = { $in: [subject] };

    const teachers = await User.find(query)
      .select("-password")
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      teachers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user can view this profile
    if (req.user.role === "student" && user._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or self)
router.put("/:id", auth, [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("language").optional().isIn(["en", "pa"]).withMessage("Invalid language")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check permissions
    if (req.user.role !== "admin" && req.params.id !== req.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, language, grade, subjects, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (language) updateData.language = language;
    if (grade) updateData.grade = grade;
    if (subjects) updateData.subjects = subjects;
    if (isActive !== undefined && req.user.role === "admin") updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private (Admin only)
router.delete("/:id", auth, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/:id/avatar
// @desc    Update user avatar
// @access  Private (self only)
router.post("/:id/avatar", auth, async (req, res) => {
  try {
    if (req.params.id !== req.userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { avatarUrl } = req.body;
    
    if (!avatarUrl) {
      return res.status(400).json({ message: "Avatar URL is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Avatar updated successfully",
      user
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics overview
// @access  Private (Admin only)
router.get("/stats/overview", auth, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalParents = await User.countDocuments({ role: "parent" });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Language distribution
    const languageStats = await User.aggregate([
      { $group: { _id: "$language", count: { $sum: 1 } } }
    ]);

    // Grade distribution for students
    const gradeStats = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$grade", count: { $sum: 1 } } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalParents,
        activeUsers
      },
      languageStats,
      gradeStats
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



























