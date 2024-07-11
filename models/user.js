const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 6,
      maxLength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile_img: {
      type: String,
      default:
        "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png",
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
  },
  { timestamps: true }
);

userSchema.pre("remove", function (next) {
  const Post = mongoose.model("Post");
  Post.deleteMany({ author: this._id })
    .then(() => next())
    .catch(next);
});

module.exports = model("User", userSchema);
