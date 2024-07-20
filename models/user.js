const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 6,
      maxLength: 23,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile_img: {
      type: String,
      default: "uploads/dev-diaries-default-profile.jpg",
    },
    bio: {
      type: String,
      default: "",
      maxLength: 400,
    },
    password: {
      type: String,
      required: true,
      min: 4,
      max: 16,
    },
    premium: { type: Boolean, default: false },
    payment_session_key: String,
    resetToken: String,
    tokenExpiration: Date,
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
