const mysql = require("mysql");

const db = mysql.createConnection({
  host: "95.216.167.73",
  user: "engteacher",
  password: "eng2020",
  database: "v2eng_teacher",
  timezone: "Asia/Colombo",
});

// Set the time zone for the MySQL connection to UTC
db.query('SET time_zone = "+05:30"', (err) => {
  if (err) {
    console.error("Error setting time zone:", err);
  }
});

// Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to MySQL database!');
// });

module.exports = db;
