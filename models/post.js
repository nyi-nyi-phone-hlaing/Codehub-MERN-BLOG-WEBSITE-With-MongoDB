const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DEFAULT_IMAGE_URL =
  "https://th.bing.com/th/id/OIG1.0F2_LJg.keG6BjHPwwjQ?w=1024&h=1024&rs=1&pid=ImgDetMain";

const ensureImageUrl = (schema) => {
  schema.pre("save", function (next) {
    if (!this.image_url || this.image_url.trim() === "") {
      this.image_url = DEFAULT_IMAGE_URL;
    }
    next();
  });
};

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      default: DEFAULT_IMAGE_URL,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    like: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislike: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

ensureImageUrl(postSchema);

module.exports = model("Post", postSchema);
