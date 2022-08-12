const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { designationsEnums } = require('./constants')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String
    },
    pic: {
      type: String
    },
    password: {
      type: String,
      required: true,
      trim: true,
      private: true, // used by the toJSON plugin
    },
    designation: {
      type: String,
      enum: designationsEnums,
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    userType: {
      type: String,
      enum: ['mentee', 'mentor']
    },
    skills: [String],
    experience: {
      duration: Number,
      unit: {
        type: String,
        enum: ['month', 'year']
      }
    },
    status: {
      type: String,
      enum: ['student', 'employed', 'unemployed', 'fresh']
    },
    cv: String,
    hiring: Boolean,
    linkedin: String,
    twitter: String,
    facebook: String,
    github: String,
    participation: [{
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    }],
    mentees: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }],
    city: String,
    rating: Number
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
