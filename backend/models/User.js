const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["student", "teacher", "parent", "admin"],
    default: "student"
  },
  avatar: {
    type: String,
    default: ""
  },
  language: {
    type: String,
    enum: ["en", "pa"], // English, Punjabi
    default: "en"
  },
  // Student specific fields
  grade: {
    type: String,
    default: ""
  },
  subjects: [{
    type: String
  }],
  // Parent specific fields
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  // Teacher specific fields
  qualifications: {
    type: String,
    default: ""
  },
  subjects_taught: [{
    type: String
  }],
  // Common fields
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Offline sync data
  offlineData: {
    lastSync: {
      type: Date,
      default: Date.now
    },
    pendingUploads: [{
      type: Object
    }]
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);


