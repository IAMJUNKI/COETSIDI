const { Sequelize } = require('sequelize');

function createSequelize(databaseName, databaseUser, databasePassword, databaseHost) {
    return new Sequelize(
        databaseName,
        databaseUser,
        databasePassword,
        {
            host: databaseHost,
            dialect: 'postgres',
            // schema: process.env.NODE_ENV === 'test' ? 'test' : 'public',
            port: 5432,
            logging: false,
        },
    );
}

const sequelize = createSequelize(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        process.env.DATABASE_HOST,
    );
  
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('\x1b[34m%s\x1b[0m', 'Successfully connected to database!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Unable to connect to the database:', error.message);
    }
};

const syncDatabase = async () => {
    try {
        await sequelize.sync();
        // await sequelize.sync({ alter: true });
        console.log('\x1b[34m%s\x1b[0m', 'Successfully synchronized with the database!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Unable to synchronize with the database:', error);
    }
};

module.exports = { sequelize, connectToDatabase, syncDatabase };
