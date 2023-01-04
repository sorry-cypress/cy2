const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

module.exports.getWaitValue = () => getRandomArbitrary(1000, 4000);
// module.exports.getWaitValue = () => 5000;
