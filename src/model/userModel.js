const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      default: "/profile.png"
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("User", userSchema)