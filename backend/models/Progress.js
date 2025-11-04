const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true
  },
  // Progress tracking
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "paused"],
    default: "not_started"
  },
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastPosition: {
    type: Number, // for video/audio - position in seconds
    default: 0
  },
  // Quiz results
  quizAttempts: [{
    attemptNumber: Number,
    answers: [Number], // array of selected answer indices
    score: Number,
    totalQuestions: Number,
    completedAt: Date,
    timeSpent: Number
  }],
  bestScore: {
    type: Number,
    default: 0
  },
  // Adaptive learning data
  difficultyLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },
  learningPath: {
    type: String,
    default: "standard" // standard, accelerated, remedial
  },
  // Gamification
  pointsEarned: {
    type: Number,
    default: 0
  },
  badges: [{
    badgeId: String,
    badgeName: String,
    earnedAt: Date,
    description: String
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  },
  // Offline sync
  isOffline: {
    type: Boolean,
    default: false
  },
  lastSync: {
    type: Date,
    default: Date.now
  },
  // Emotion detection data
  emotionData: [{
    timestamp: Date,
    emotion: {
      type: String,
      enum: ["happy", "confused", "frustrated", "engaged", "bored"]
    },
    confidence: Number,
    context: String
  }],
  // Learning analytics
  learningStyle: {
    type: String,
    enum: ["visual", "auditory", "kinesthetic", "reading"],
    default: "visual"
  },
  attentionSpan: {
    average: Number, // in minutes
    sessions: [{
      startTime: Date,
      endTime: Date,
      duration: Number
    }]
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ user: 1, content: 1 }, { unique: true });
progressSchema.index({ user: 1, status: 1 });
progressSchema.index({ user: 1, "badges.badgeId": 1 });

// Calculate streak
progressSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = this.streak.lastActivity;
  
  if (!lastActivity) {
    this.streak.current = 1;
    this.streak.longest = 1;
    this.streak.lastActivity = today;
    return;
  }
  
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.streak.current += 1;
    this.streak.longest = Math.max(this.streak.longest, this.streak.current);
  } else if (daysDiff > 1) {
    // Streak broken
    this.streak.current = 1;
  }
  
  this.streak.lastActivity = today;
};

// Calculate learning style based on interaction patterns
progressSchema.methods.calculateLearningStyle = function() {
  // This would be implemented based on user interaction patterns
  // For now, returning default
  return this.learningStyle;
};

module.exports = mongoose.model("Progress", progressSchema);


