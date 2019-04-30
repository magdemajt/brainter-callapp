module.exports = {
  server: 'localhost',
  apiPort: process.env.NODE_ENV !== 'production' ? 8080 : 3000,
  // build version
  // apiPort: 3000,
  clientPort: 3000
};
