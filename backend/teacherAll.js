const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

// Use body-parser middleware
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

// Define an API endpoint to fetch data from multiple tables based on stu_id
app.get("/api/data/teacherAll/:id?", (req, res) => {
  const stuId = req.params.id;

  // Execute multiple SQL queries to fetch data from different tables
  const sqlQueries = [
    `SELECT * FROM Teacher WHERE t_id = ?`,
    `SELECT * FROM Payment WHERE t_id = ?`,
    `SELECT * FROM Student_Schedule WHERE t_id = ?`,
    `SELECT * FROM Teacher_Qualification WHERE t_id = ?`,
    `SELECT * FROM Teacher_Schedule WHERE t_id = ?`,
    `SELECT * FROM Teacher_Skill WHERE t_id = ?`,
  ];

  // Use Promise.all to execute all queries concurrently
  Promise.all(sqlQueries.map((query) => executeQuery(query, [stuId])))
    .then((results) => {
      // Combine the results from different tables into a single response
      const [
        teacherResults,
        paymentResults,
        student_scheduleResults,
        teacher_qualificationResults,
        teacher_scheduleResults,
        teacher_skillResults,
      ] = results;

      const combinedResponse = {
        teacherData: teacherResults[0],
        paymentData: paymentResults[0],
        student_scheduleData: student_scheduleResults[0],
        teacher_qualificationData: teacher_qualificationResults[0],
        teacher_scheduleData: teacher_scheduleResults[0],
        teacher_skillData: teacher_skillResults[0],
      };

      res.json(combinedResponse);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Helper function to execute a single SQL query
function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
