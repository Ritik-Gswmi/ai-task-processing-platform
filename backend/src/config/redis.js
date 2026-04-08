
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

module.exports = redis;