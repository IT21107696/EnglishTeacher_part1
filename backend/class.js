const express = require("express");

const bodyParser = require("body-parser");
const db = require("./database");

const app = express();

//use body-parser middleware
app.use(bodyParser.json());

// Define an API endpoint to fetch data from a specific table
app.get("/api/data/class/:id?", (req, res) => {
  // here i used c_id as id
  const tableName = "Class"; // Replace 'Class' with your actual table name
  const id = req.params.id;

  // Your SQL query to fetch data from the specified table
  const sqlQuery = id
    ? `SELECT * FROM ${tableName} WHERE c_id = ?`
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
app.post("/api/data/class", (req, res) => {
  const tableName = "Class";
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
