const moment = require("moment");

// Define a helper function for EJS
const timeAgo = (date) => {
  const duration = moment.duration(moment().diff(moment(date)));
  const seconds = duration.asSeconds();
  const minutes = duration.asMinutes();
  const hours = duration.asHours();
  const days = duration.asDays();

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return Math.floor(minutes) + " min ago";
  } else if (hours < 24) {
    return Math.floor(hours) + " hr ago";
  } else if (days < 7) {
    return Math.floor(days) + " day ago";
  } else if (days < 30) {
    return Math.floor(days / 7) + " wk ago";
  } else if (days < 365) {
    return Math.floor(days / 30) + " mo ago";
  } else {
    return Math.floor(days / 365) + " yr ago";
  }
};

module.exports = timeAgo;
