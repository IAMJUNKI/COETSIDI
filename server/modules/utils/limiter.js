const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient, connect } = require('./redisClient.js');

async function createLimiters() {
  await connect();

  const maxWrongAttemptsByIPperMinute = 5;
  const maxWrongAttemptsByIPperDay = 20;
  const maxConsecutiveFailsByUsernameAndIP = 10;
  const maxConsecutiveFailsByUsername = 15;

  const limiterSlowBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, // Block for 1 day, if 20 wrong attempts per day
  });

  const limiterFastBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_ip_per_minute',
    points: maxWrongAttemptsByIPperMinute,
    duration: 30,
    blockDuration: 60 * 60 * 24, // Block for 1 day, if 5 wrong attempts per 30 seconds
  });

  const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24, // Store number for 1 day since first fail
    blockDuration: 60 * 60, // 1 hour
  });

  const limiterConsecutiveFailsByUsername = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_consecutive_username',
    points: maxConsecutiveFailsByUsername,
    duration: 60 * 60 * 24 , // Store number for 1 day since first fail
    blockDuration: 60 * 60 * 5, // 5 hours block
  });

  return {
    limiterConsecutiveFailsByUsername,
    limiterConsecutiveFailsByUsernameAndIP,
    limiterSlowBruteByIP,
    limiterFastBruteByIP,
    maxWrongAttemptsByIPperDay,
    maxWrongAttemptsByIPperMinute,
    maxConsecutiveFailsByUsernameAndIP,
    maxConsecutiveFailsByUsername,
  };
}

module.exports = createLimiters;
