const fs = require("fs");

const fileDelete = (file) => {
  fs.unlink(file, (err) => {
    if (err) throw err;
    console.log(`${file} was deleted.`);
  });
};

module.exports = fileDelete;
