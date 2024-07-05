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
app.get("/api/data/studentAll/:id?", (req, res) => {
  const stuId = req.params.id;

  // Execute multiple SQL queries to fetch data from different tables
  const sqlQueries = [
    `SELECT stu_id,stu_fname,stu_lname,phone_num,email,	NIC FROM Student WHERE stu_id = ?`,
    `SELECT * FROM Class WHERE stu_id = ?`,
    `SELECT * FROM Payment WHERE stu_id = ?`,
    `SELECT * FROM Student_Schedule WHERE stu_id = ?`,
    `SELECT t_id, t_fname, t_lname FROM Teacher WHERE t_id IN (SELECT t_id FROM Student WHERE stu_id = ?)`,
    `SELECT * FROM Teacher_Review WHERE stu_id = ?`,
  ];

  // Use Promise.all to execute all queries concurrently
  Promise.all(sqlQueries.map((query) => executeQuery(query, [stuId])))
    .then((results) => {
      // Combine the results from different tables into a single response
      const [
        studentResults,
        classResults,
        paymentResults,
        student_scheduleResults,
        teacherResults,
        teacher_reviewResults,
      ] = results;

      const combinedResponse = {
        studentData: studentResults[0],
        classData: classResults[0],
        paymentData: paymentResults[0],
        student_scheduleData: student_scheduleResults[0],
        teacherData: teacherResults[0],
        teacher_reviewData: teacher_reviewResults[0],
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
