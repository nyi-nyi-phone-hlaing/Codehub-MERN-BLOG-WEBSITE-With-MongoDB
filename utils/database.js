//* NPM packages
const mongodb = require("mongodb");
const dotenv = require("dotenv").config();

//* Initializing
const MongoClient = mongodb.MongoClient;

const mongodbConnector = () => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connect to MongoDB");
    })
    .catch((err) => console.log(err));
};

module.exports = mongodbConnector;
