

const dbCredentials = {
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'postgres'
}



const knex = require('knex')({
    client: 'pg',
    version: '5.7',
    connection: {
        host: dbCredentials.host,
        port: 5432,
        user: dbCredentials.user,
        password: dbCredentials.password,
        database: dbCredentials.database
    }
})


module.exports = { knex }
