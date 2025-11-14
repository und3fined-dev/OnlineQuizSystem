const mysql2 = require ('mysql2');
require("dotenv").config();             //loads var from .env into process.env

//Create connection
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Connect
db.connect((err) => {
    if (err)
    {
        console.error("Database Connection Failed:", err.stack);
        return;
    }
    console.log ("Connected to MySQL");
});
module.exports = db;             //To export consts, modules etc
