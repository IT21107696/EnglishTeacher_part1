const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

//use body-parser middleware
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: "95.216.167.73",
  user: "engteacher",
  password: "eng2020",
  database: "v2eng_teacher",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Define an API endpoint to fetch data from a specific table
app.get("/api/data/studentVe", (req, res) => {
  // Your SQL query to fetch specific fields when verification is 1
  const sqlQuery = `SELECT * FROM Student`;

  // Execute the query
  connection.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "Data not found" });
      return;
    }

    res.json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
