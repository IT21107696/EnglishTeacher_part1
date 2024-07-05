const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
  host: "95.216.167.73",
  user: "engteacher",
  password: "eng2020",
  database: "v2eng_teacher",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for OTP verification
app.post("/api/verify", (req, res) => {
  const { stu_id, OTP } = req.body;

  try {
    const selectQuery = "SELECT `OTP` FROM `Student` WHERE `stu_id` = ?";
    db.query(selectQuery, [stu_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving student" });
      } else {
        const storedOTP = results[0].OTP;
        const storedverification = results[0].verification;

        if (OTP == storedOTP) {
          const updateQuery =
            "UPDATE `Student` SET `verification` = 1 ,`OTP` = NULL WHERE `stu_id` = ?";
          db.query(updateQuery, [stu_id], (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              res.status(500).json({
                message: "Error updating student verification status",
              });
            } else {
              if (updateResults.changedRows > 0) {
                res.json({
                  message:
                    "OTP verification successful. Verification status set to 1",
                });
              } else {
                res.json({
                  message:
                    "OTP verification successful. No changes made to verification status",
                });
              }
            }
          });
        } else {
          res.json({ message: "OTP verification failed. Incorrect OTP." });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});
const port = 3000;

app.listen(port, () => {
  console.log(`App is running on PORT: ${port}.`);
});
