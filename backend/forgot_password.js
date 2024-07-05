const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const db = require("./database");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Generate a random 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Endpoint to initiate forgot password process
app.post("/forgot-password", (req, res) => {
  const { identifier } = req.body; // email or phone number

  // Check if the identifier exists in the Student table
  db.query(
    "SELECT stu_id, email, phone_num FROM Student WHERE email = ? OR phone_num = ?",
    [identifier, identifier],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const { stu_id, email, phone_num } = results[0];

      // Generate OTP
      const otp = generateOTP();

      // Save OTP to the database and update verification status
      db.query(
        "UPDATE Student SET otp = ? WHERE stu_id = ?",
        [otp, stu_id],
        (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // TODO: Send OTP to the user's email or phone number (implement your logic here)

          res.json({ message: "OTP sent successfully" });
        }
      );
    }
  );
});

// Endpoint to verify OTP and change password
app.post("/verify-otp", (req, res) => {
  const { stuId, otp, newPassword, retypePassword } = req.body;

  // Check if the new passwords match
  if (newPassword !== retypePassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  // Check if the OTP is correct
  db.query(
    "SELECT stu_id FROM Student WHERE stu_id = ? AND otp = ?",
    [stuId, otp],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid OTP" });
      }

      // Update password and reset verification status and OTP in the database
      db.query(
        "UPDATE Student SET password = ?, verification = 1, otp = NULL WHERE stu_id = ?",
        [newPassword, stuId],
        (updateErr) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.json({ message: "Password changed successfully" });
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//forgot-password

//{
//"identifier": "gayani@gmail.com" // Replace with the user's email or phone number
//}

//verify-otp

//{
//"stuId": "17", // Replace with the actual user ID
//"otp": "1346", // Replace with the OTP sent to the user
//"newPassword": "HGH", // Replace with the new password
//"retypePassword": "HGH" // Retype the new password
//}
