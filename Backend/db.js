// require("dotenv").config({ path: "./backend/.env" });

// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });

// db.connect((err) => {
//     if (err) {
//         console.log("Database connection failed:", err.message);
//         return;
//     }

//     console.log("MySQL Database Connected Successfully!");
// });

// module.exports = db;


const { Pool } = require("pg");
require("dotenv").config({ path: "Backend/.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(client => {
    console.log("PostgreSQL Database Connected Successfully!");
    client.release();
  })
  .catch(err => {
    console.error("PostgreSQL Connection Error:", err.message);
  });

module.exports = pool;
