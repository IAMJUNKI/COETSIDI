require('dotenv').config({ path: '../../.env' });

// console.info('\x1b[33m%s\x1b[0m', 'ATENTION! If running production migrations uncomment the dialect in database/config.js');

module.exports = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
    }
};