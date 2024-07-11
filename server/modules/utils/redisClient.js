const { createClient } = require('redis');

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-16734.c232.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 16734,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

let connected = false;

function connect() {
  return new Promise((resolve, reject) => {
    if (connected) {
      resolve();
    } else {
      redisClient.connect()
        .then(() => {
          console.log('Connected to Redis');
          connected = true;
          resolve();
        })
        .catch((err) => {
          console.error('Failed to connect to Redis:', err);
          reject(err);
        });
    }
  });
}

module.exports = { redisClient, connect };
