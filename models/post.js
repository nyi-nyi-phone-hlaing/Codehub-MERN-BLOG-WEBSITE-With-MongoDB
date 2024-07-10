const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DEFAULT_IMAGE_URL =
  "https://wallpapers.com/images/hd/plain-light-blue-background-2560-x-1440-gsp5z0x4fwby74an.jpg";

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
  },
  { timestamps: true }
);

ensureImageUrl(postSchema);

module.exports = model("Post", postSchema);
