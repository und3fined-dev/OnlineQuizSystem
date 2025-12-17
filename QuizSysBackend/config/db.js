const mysql2 = require ('mysql2');
require("dotenv").config();             //loads var from .env into process.env

//Create connection
const db = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
});

//Connect
db.getConnection((err) => {
    if (err)
    {
        console.error("Database Connection Failed:", err.stack);
        return;
    }
    console.log ("Connected to MySQL");
});
module.exports = db;             //To export consts, modules etc
