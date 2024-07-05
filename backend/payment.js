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
app.get("/api/data/payment/:id?", (req, res) => {
  // here i used pay_id as id
  const tableName = "Payment";
  const id = req.params.id;

  // Your SQL query to fetch data from the specified table
  const sqlQuery = id
    ? `SELECT * FROM ${tableName} WHERE pay_id = ?`
    : `SELECT * FROM ${tableName}`;

  // Execute the query
  connection.query(sqlQuery, [id], (error, results) => {
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
// Define an API endpoint to handle POST requests
app.post("/api/data/payment", (req, res) => {
  const tableName = "Payment";
  const newRecord = req.body;

  connection.query(
    `INSERT INTO ${tableName} SET ?`,
    newRecord,
    (error, result) => {
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(201).json({
        message: "Record created successfully",
        insertId: result.insertId,
      });
    }
  );
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
