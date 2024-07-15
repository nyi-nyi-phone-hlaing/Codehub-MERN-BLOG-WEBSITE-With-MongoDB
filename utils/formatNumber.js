function formatNumber(num) {
  num = Number(num);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B"; // 1e9 is 1,000,000,000 ( 9 Zeros )
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M"; // 1e6 is 1,000,000 ( 6 Zeros )
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "k"; // 1e3 is 1,000 (3 Zeros )
  } else {
    return num.toString();
  }
}

module.exports = formatNumber;
