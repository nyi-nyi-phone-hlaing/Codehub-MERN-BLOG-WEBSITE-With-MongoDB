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
      default:
        "https://th.bing.com/th/id/OIG1.0F2_LJg.keG6BjHPwwjQ?w=1024&h=1024&rs=1&pid=ImgDetMain",
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
    resetToken: String,
    tokenExpiration: Date,
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
