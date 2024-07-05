const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();

// Middleware for parsing JSON in the request body
app.use(bodyParser.json());

// Generate a random 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Endpoint for user signup
app.post("/signup", (req, res) => {
  const { email, phone_num, password, retype_password } = req.body;

  // Check if passwords match
  if (password !== retype_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Generate OTP
  const otp = generateOTP();

  // Insert user data into the database with signup time and date
  const insertQuery =
    "INSERT INTO Student (email, phone_num, password, otp, verification, date) VALUES (?, ?, ?, ?, 0, NOW())";
  db.query(insertQuery, [email, phone_num, password, otp], (err, result) => {
    if (err) {
      console.error("Error inserting user data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Check if the insert was successful
      if (result.affectedRows > 0) {
        res.json({ message: "Signup process was successful" });
      } else {
        res.status(400).json({ error: "Failed to insert user data" });
      }
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//{
//"email": "user@example.com",
//"phone_num": "1234567890",
//"password": "password123",
// "retype_password": "password123"
//}
