//* NPM packages
const mongodb = require("mongodb");
const dotenv = require("dotenv").config();

//* Initializing
const MongoClient = mongodb.MongoClient;
let db;

const mongodbConnector = () => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then((m) => {
      console.log("Connect to MongoDB");
      db = m.db();
    })
    .catch((err) => console.log(err));
};

const getDatabase = () => {
  if (db) {
    return db;
  } else {
    throw "No Database";
  }
};

module.exports = { mongodbConnector, getDatabase };
