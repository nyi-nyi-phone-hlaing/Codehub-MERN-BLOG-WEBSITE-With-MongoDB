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
    return db.collection("posts").find().sort({ title: 1 }).toArray();
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

  update(id) {
    const db = getDatabase();
    return db
      .collection("posts")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: this });
  }

  static delete(id) {
    const db = getDatabase();
    return db.collection("posts").deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Post;
