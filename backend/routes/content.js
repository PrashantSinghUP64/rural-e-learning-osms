const express = require("express");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
const Content = require("../models/Content");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// ... (multer configuration code remains the same) ...
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage /* ... limits and fileFilter */ });


// @route   GET /api/content
// @desc    Get all content with filters
// @access  Public (Auth removed for now)
router.get("/", async (req, res) => { // I have removed 'auth' from this line
  try {
    const {
      type,
      subject,
      grade,
      language,
      difficulty,
      status = "approved",
      page = 1,
      limit = 10,
      search
    } = req.query;

    const query = { status };

    if (type) query.type = type;
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    const content = await Content.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(query);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ... (all other routes like GET /:id, POST, PUT, DELETE will remain the same and protected by auth) ...

// @route   GET /api/content/offline
// @desc    Get content optimized for offline use
// @access  Private
router.get("/offline", auth, async (req, res) => {
  // ...
});

// @route   GET /api/content/:id
// @desc    Get content by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  // ...
});

// @route   POST /api/content
// @desc    Create new content
// @access  Private (Teachers, Admin)
router.post("/", auth, authorize("teacher", "admin"), upload.single("file"), [
  // ...
], async (req, res) => {
  // ...
});

// ... (and so on for PUT, DELETE, etc.) ...

module.exports = router;

















