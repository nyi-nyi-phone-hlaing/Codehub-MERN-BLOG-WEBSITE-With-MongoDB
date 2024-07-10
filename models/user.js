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
    password: {
      type: String,
      required: true,
      min: 4,
      max: 16,
    },
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
