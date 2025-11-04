const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ["en", "pa"],
    default: "en"
  },
  // Teacher information
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Students
  students: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active"
    }
  }],
  // Classroom settings
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowStudentUploads: {
      type: Boolean,
      default: false
    },
    enableChat: {
      type: Boolean,
      default: true
    },
    enableVoiceChat: {
      type: Boolean,
      default: true
    },
    maxStudents: {
      type: Number,
      default: 50
    }
  },
  // Schedule
  schedule: {
    days: [{
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    }],
    startTime: String, // HH:MM format
    endTime: String,   // HH:MM format
    timezone: {
      type: String,
      default: "Asia/Kolkata"
    }
  },
  // Content and assignments
  content: [{
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content"
    },
    assignedAt: Date,
    dueDate: Date,
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  assignments: [{
    title: String,
    description: String,
    content: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content"
    }],
    dueDate: Date,
    maxPoints: Number,
    instructions: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Live session data
  liveSessions: [{
    sessionId: String,
    startTime: Date,
    endTime: Date,
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      joinedAt: Date,
      leftAt: Date,
      isActive: Boolean
    }],
    recording: {
      url: String,
      duration: Number
    }
  }],
  // Chat messages
  messages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  }],
  // Analytics
  analytics: {
    totalSessions: {
      type: Number,
      default: 0
    },
    averageAttendance: {
      type: Number,
      default: 0
    },
    engagementScore: {
      type: Number,
      default: 0
    }
  },
  // Status
  status: {
    type: String,
    enum: ["active", "archived", "suspended"],
    default: "active"
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
classroomSchema.index({ teacher: 1, status: 1 });
classroomSchema.index({ "students.user": 1 });
classroomSchema.index({ subject: 1, grade: 1 });

// Virtual for student count
classroomSchema.virtual("studentCount").get(function() {
  return this.students.filter(student => student.status === "active").length;
});

// Method to add student
classroomSchema.methods.addStudent = function(userId) {
  const existingStudent = this.students.find(
    student => student.user.toString() === userId.toString()
  );
  
  if (!existingStudent) {
    this.students.push({
      user: userId,
      joinedAt: new Date(),
      status: "active"
    });
  }
  
  return this.save();
};

// Method to remove student
classroomSchema.methods.removeStudent = function(userId) {
  this.students = this.students.filter(
    student => student.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to start live session
classroomSchema.methods.startLiveSession = function() {
  const sessionId = `session_${Date.now()}`;
  this.liveSessions.push({
    sessionId,
    startTime: new Date(),
    participants: []
  });
  return this.save();
};

// Method to end live session
classroomSchema.methods.endLiveSession = function(sessionId) {
  const session = this.liveSessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.endTime = new Date();
  }
  return this.save();
};

module.exports = mongoose.model("Classroom", classroomSchema);


