const express = require("express");
const { body, validationResult } = require("express-validator");
const Classroom = require("../models/Classroom");
const User = require("../models/User");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/classroom
// @desc    Get classrooms for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { role, status = "active" } = req.query;
    let query = { status };

    if (req.user.role === "teacher") {
      query.teacher = req.userId;
    } else if (req.user.role === "student") {
      query["students.user"] = req.userId;
    } else if (req.user.role === "parent") {
      // Get classrooms of children
      const children = await User.find({ 
        _id: { $in: req.user.children } 
      }).select("_id");
      const childIds = children.map(child => child._id);
      query["students.user"] = { $in: childIds };
    }

    const classrooms = await Classroom.find(query)
      .populate("teacher", "name email avatar")
      .populate("students.user", "name email avatar grade")
      .sort({ createdAt: -1 });

    res.json({ classrooms });
  } catch (error) {
    console.error("Get classrooms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/classroom/public
// @desc    Get public classrooms
// @access  Private
router.get("/public", auth, async (req, res) => {
  try {
    const { subject, grade, language, page = 1, limit = 10 } = req.query;
    const query = { 
      status: "active",
      "settings.isPublic": true
    };

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (language) query.language = language;

    const classrooms = await Classroom.find(query)
      .populate("teacher", "name email avatar qualifications")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Classroom.countDocuments(query);

    res.json({
      classrooms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get public classrooms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/classroom/:id
// @desc    Get classroom by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate("teacher", "name email avatar qualifications")
      .populate("students.user", "name email avatar grade")
      .populate("content.contentId", "title type subject grade")
      .populate("messages.user", "name avatar");

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if user has access to this classroom
    const hasAccess = 
      classroom.teacher._id.toString() === req.userId.toString() ||
      classroom.students.some(student => student.user._id.toString() === req.userId.toString()) ||
      req.user.role === "admin";

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ classroom });
  } catch (error) {
    console.error("Get classroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom
// @desc    Create new classroom
// @access  Private (Teachers, Admin)
router.post("/", auth, authorize("teacher", "admin"), [
  body("name").trim().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
  body("description").optional().trim(),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("grade").notEmpty().withMessage("Grade is required"),
  body("language").isIn(["en", "pa"]).withMessage("Invalid language")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      subject,
      grade,
      language,
      settings,
      schedule
    } = req.body;

    const classroomData = {
      name,
      description,
      subject,
      grade,
      language,
      teacher: req.userId,
      settings: settings || {},
      schedule: schedule || {}
    };

    const classroom = new Classroom(classroomData);
    await classroom.save();

    await classroom.populate("teacher", "name email avatar");

    res.status(201).json({
      message: "Classroom created successfully",
      classroom
    });
  } catch (error) {
    console.error("Create classroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/classroom/:id
// @desc    Update classroom
// @access  Private (Teacher, Admin)
router.put("/:id", auth, [
  body("name").optional().trim().isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check permissions
    if (classroom.teacher.toString() !== req.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updateData = req.body;
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("teacher", "name email avatar");

    res.json({
      message: "Classroom updated successfully",
      classroom: updatedClassroom
    });
  } catch (error) {
    console.error("Update classroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/join
// @desc    Join classroom
// @access  Private
router.post("/:id/join", auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if classroom is public or user is invited
    if (!classroom.settings.isPublic) {
      return res.status(403).json({ message: "This classroom is private" });
    }

    // Check if user is already a student
    const existingStudent = classroom.students.find(
      student => student.user.toString() === req.userId.toString()
    );

    if (existingStudent) {
      return res.status(400).json({ message: "You are already a member of this classroom" });
    }

    // Check classroom capacity
    if (classroom.students.length >= classroom.settings.maxStudents) {
      return res.status(400).json({ message: "Classroom is full" });
    }

    await classroom.addStudent(req.userId);

    res.json({ message: "Successfully joined classroom" });
  } catch (error) {
    console.error("Join classroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/leave
// @desc    Leave classroom
// @access  Private
router.post("/:id/leave", auth, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    await classroom.removeStudent(req.userId);

    res.json({ message: "Successfully left classroom" });
  } catch (error) {
    console.error("Leave classroom error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/students
// @desc    Add student to classroom (Teacher only)
// @access  Private (Teacher, Admin)
router.post("/:id/students", auth, authorize("teacher", "admin"), [
  body("studentId").isMongoId().withMessage("Valid student ID is required")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId } = req.body;
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check permissions
    if (classroom.teacher.toString() !== req.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if student exists and is actually a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student" });
    }

    await classroom.addStudent(studentId);

    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Add student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/classroom/:id/students/:studentId
// @desc    Remove student from classroom (Teacher only)
// @access  Private (Teacher, Admin)
router.delete("/:id/students/:studentId", auth, authorize("teacher", "admin"), async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check permissions
    if (classroom.teacher.toString() !== req.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await classroom.removeStudent(req.params.studentId);

    res.json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Remove student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/assignments
// @desc    Create assignment
// @access  Private (Teacher, Admin)
router.post("/:id/assignments", auth, authorize("teacher", "admin"), [
  body("title").trim().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("dueDate").isISO8601().withMessage("Valid due date is required")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check permissions
    if (classroom.teacher.toString() !== req.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, content, dueDate, maxPoints, instructions } = req.body;

    const assignment = {
      title,
      description,
      content: content || [],
      dueDate: new Date(dueDate),
      maxPoints: maxPoints || 100,
      instructions: instructions || ""
    };

    classroom.assignments.push(assignment);
    await classroom.save();

    res.json({
      message: "Assignment created successfully",
      assignment: classroom.assignments[classroom.assignments.length - 1]
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/messages
// @desc    Send message to classroom
// @access  Private
router.post("/:id/messages", auth, [
  body("message").trim().isLength({ min: 1 }).withMessage("Message cannot be empty")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check if user is member of classroom
    const isMember = 
      classroom.teacher.toString() === req.userId.toString() ||
      classroom.students.some(student => student.user.toString() === req.userId.toString());

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { message, type = "text" } = req.body;

    const newMessage = {
      user: req.userId,
      message,
      type,
      timestamp: new Date()
    };

    classroom.messages.push(newMessage);
    await classroom.save();

    // Emit to socket room
    req.io.to(req.params.id).emit("new-message", {
      ...newMessage,
      user: {
        _id: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar
      }
    });

    res.json({
      message: "Message sent successfully",
      chatMessage: newMessage
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/live-session/start
// @desc    Start live session
// @access  Private (Teacher, Admin)
router.post("/:id/live-session/start", auth, authorize("teacher", "admin"), async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check permissions
    if (classroom.teacher.toString() !== req.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const session = await classroom.startLiveSession();

    // Emit to socket room
    req.io.to(req.params.id).emit("live-session-started", {
      sessionId: session.liveSessions[session.liveSessions.length - 1].sessionId
    });

    res.json({
      message: "Live session started",
      sessionId: session.liveSessions[session.liveSessions.length - 1].sessionId
    });
  } catch (error) {
    console.error("Start live session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/classroom/:id/live-session/end
// @desc    End live session
// @access  Private (Teacher, Admin)
router.post("/:id/live-session/end", auth, authorize("teacher", "admin"), async (req, res) => {
  try {
    const { sessionId } = req.body;
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Check permissions
    if (classroom.teacher.toString() !== req.userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await classroom.endLiveSession(sessionId);

    // Emit to socket room
    req.io.to(req.params.id).emit("live-session-ended", { sessionId });

    res.json({ message: "Live session ended" });
  } catch (error) {
    console.error("End live session error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


























