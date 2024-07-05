const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint to change password
app.post("/change-password", (req, res) => {
  const { stuId, currentPassword, newPassword, retypePassword } = req.body;

  // Check if the new passwords match
  if (newPassword !== retypePassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  // Check the current password in the database
  db.query(
    "SELECT password FROM Student WHERE stu_id = ? AND password = ?",
    [stuId, currentPassword],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Update the password in the database
      db.query(
        "UPDATE Student SET password = ? WHERE stu_id = ?",
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

//postman
//{
//"stuId": 1,
//"currentPassword": "oldPassword",
//"newPassword": "newPassword123",
//"retypePassword": "newPassword123"
//}
