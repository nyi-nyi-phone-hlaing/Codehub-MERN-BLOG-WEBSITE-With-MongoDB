const { getDatabase } = require("../utils/database");
const mongodb = require("mongodb");

class Post {
  constructor(title, description, image_url) {
    this.title = title;
    this.description = description;
    this.image_url = image_url;
  }

  static find() {
    const db = getDatabase();
    return db.collection("posts").find().toArray();
  }

  static findById(id) {
    const db = getDatabase();
    const postId = new mongodb.ObjectId(id);
    return db.collection("posts").find({ _id: postId }).next();
  }

  create() {
    const db = getDatabase();
    return db.collection("posts").insertOne(this);
  }
}

module.exports = Post;
