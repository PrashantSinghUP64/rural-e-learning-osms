const express = require("express");
const { body, validationResult } = require("express-validator");
const Progress = require("../models/Progress");
const Content = require("../models/Content");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/progress
// @desc    Get user's learning progress
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { subject, grade, status, page = 1, limit = 20 } = req.query;
    const query = { user: req.userId };

    if (status) query.status = status;

    const progress = await Progress.find(query)
      .populate("content", "title type subject grade difficulty")
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter by subject/grade if specified
    let filteredProgress = progress;
    if (subject || grade) {
      filteredProgress = progress.filter(p => {
        const content = p.content;
        if (!content) return false;
        if (subject && content.subject !== subject) return false;
        if (grade && content.grade !== grade) return false;
        return true;
      });
    }

    const total = await Progress.countDocuments(query);

    res.json({
      progress: filteredProgress,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/progress/stats
// @desc    Get user's learning statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Basic stats
    const totalContent = await Progress.countDocuments({ user: userId });
    const completedContent = await Progress.countDocuments({ 
      user: userId, 
      status: "completed" 
    });
    const inProgressContent = await Progress.countDocuments({ 
      user: userId, 
      status: "in_progress" 
    });

    // Time spent
    const timeStats = await Progress.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalTime: { $sum: "$timeSpent" } } }
    ]);

    // Points and badges
    const pointsStats = await Progress.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalPoints: { $sum: "$pointsEarned" } } }
    ]);

    // Subject-wise progress
    const subjectProgress = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "contents",
          localField: "content",
          foreignField: "_id",
          as: "contentData"
        }
      },
      { $unwind: "$contentData" },
      {
        $group: {
          _id: "$contentData.subject",
          totalContent: { $sum: 1 },
          completedContent: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          totalPoints: { $sum: "$pointsEarned" }
        }
      }
    ]);

    // Recent activity
    const recentActivity = await Progress.find({ user: userId })
      .populate("content", "title type subject")
      .sort({ updatedAt: -1 })
      .limit(5);

    // Streak information
    const streakInfo = await Progress.findOne({ user: userId })
      .sort({ "streak.lastActivity": -1 });

    res.json({
      overview: {
        totalContent,
        completedContent,
        inProgressContent,
        completionRate: totalContent > 0 ? (completedContent / totalContent) * 100 : 0
      },
      timeSpent: timeStats[0]?.totalTime || 0,
      totalPoints: pointsStats[0]?.totalPoints || 0,
      subjectProgress,
      recentActivity,
      streak: streakInfo?.streak || { current: 0, longest: 0 }
    });
  } catch (error) {
    console.error("Get progress stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/progress
// @desc    Create or update learning progress
// @access  Private
router.post("/", auth, [
  body("contentId").isMongoId().withMessage("Valid content ID is required"),
  body("status").optional().isIn(["not_started", "in_progress", "completed", "paused"]),
  body("progressPercentage").optional().isInt({ min: 0, max: 100 }),
  body("timeSpent").optional().isInt({ min: 0 }),
  body("lastPosition").optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      contentId,
      status = "in_progress",
      progressPercentage = 0,
      timeSpent = 0,
      lastPosition = 0,
      emotionData
    } = req.body;

    // Check if content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Find existing progress or create new
    let progress = await Progress.findOne({
      user: req.userId,
      content: contentId
    });

    if (progress) {
      // Update existing progress
      progress.status = status;
      progress.progressPercentage = progressPercentage;
      progress.timeSpent += timeSpent;
      progress.lastPosition = lastPosition;
      progress.lastSync = new Date();

      if (emotionData) {
        progress.emotionData.push({
          timestamp: new Date(),
          emotion: emotionData.emotion,
          confidence: emotionData.confidence,
          context: emotionData.context
        });
      }

      // Update streak
      progress.updateStreak();

      // Award points for completion
      if (status === "completed" && progress.status !== "completed") {
        progress.pointsEarned += 50; // Base points for completion
        
        // Bonus points for perfect score
        if (progressPercentage === 100) {
          progress.pointsEarned += 25;
        }
      }

    } else {
      // Create new progress
      progress = new Progress({
        user: req.userId,
        content: contentId,
        status,
        progressPercentage,
        timeSpent,
        lastPosition,
        lastSync: new Date()
      });

      if (emotionData) {
        progress.emotionData.push({
          timestamp: new Date(),
          emotion: emotionData.emotion,
          confidence: emotionData.confidence,
          context: emotionData.context
        });
      }

      progress.updateStreak();
    }

    await progress.save();

    res.json({
      message: "Progress updated successfully",
      progress
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/progress/quiz
// @desc    Submit quiz attempt
// @access  Private
router.post("/quiz", auth, [
  body("contentId").isMongoId().withMessage("Valid content ID is required"),
  body("answers").isArray().withMessage("Answers must be an array"),
  body("timeSpent").optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contentId, answers, timeSpent = 0 } = req.body;

    // Get content with questions
    const content = await Content.findById(contentId);
    if (!content || content.type !== "quiz") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let correctAnswers = 0;
    const results = [];

    content.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      results.push({
        questionIndex: index,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = Math.round((correctAnswers / content.questions.length) * 100);

    // Find or create progress
    let progress = await Progress.findOne({
      user: req.userId,
      content: contentId
    });

    if (!progress) {
      progress = new Progress({
        user: req.userId,
        content: contentId,
        status: "completed"
      });
    }

    // Add quiz attempt
    const attemptNumber = progress.quizAttempts.length + 1;
    progress.quizAttempts.push({
      attemptNumber,
      answers,
      score,
      totalQuestions: content.questions.length,
      completedAt: new Date(),
      timeSpent
    });

    // Update best score
    if (score > progress.bestScore) {
      progress.bestScore = score;
    }

    // Award points based on score
    const pointsEarned = Math.round((score / 100) * 100); // Max 100 points
    progress.pointsEarned += pointsEarned;

    // Update status if score is good enough
    if (score >= 70) {
      progress.status = "completed";
      progress.progressPercentage = 100;
    }

    progress.updateStreak();
    await progress.save();

    res.json({
      message: "Quiz submitted successfully",
      results: {
        score,
        correctAnswers,
        totalQuestions: content.questions.length,
        pointsEarned,
        attemptNumber,
        results
      },
      progress
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/progress/:contentId
// @desc    Get progress for specific content
// @access  Private
router.get("/:contentId", auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.userId,
      content: req.params.contentId
    }).populate("content", "title type subject grade difficulty questions");

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json({ progress });
  } catch (error) {
    console.error("Get content progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/progress/:contentId
// @desc    Update progress for specific content
// @access  Private
router.put("/:contentId", auth, [
  body("status").optional().isIn(["not_started", "in_progress", "completed", "paused"]),
  body("progressPercentage").optional().isInt({ min: 0, max: 100 }),
  body("timeSpent").optional().isInt({ min: 0 }),
  body("lastPosition").optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const progress = await Progress.findOne({
      user: req.userId,
      content: req.params.contentId
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    const updateData = req.body;
    updateData.lastSync = new Date();

    Object.assign(progress, updateData);
    progress.updateStreak();
    await progress.save();

    res.json({
      message: "Progress updated successfully",
      progress
    });
  } catch (error) {
    console.error("Update content progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


























