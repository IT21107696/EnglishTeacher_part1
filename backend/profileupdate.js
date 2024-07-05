const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = 3000;

// Middleware for parsing JSON in the request body
app.use(bodyParser.json());

// Endpoint for updating student profile
app.put("/update-profile/:stu_id", (req, res) => {
  const stu_id = req.params.stu_id;
  const { stu_fname, stu_lname, email, phone_num, NIC } = req.body;

  // Update student profile in the database
  const updateQuery =
    "UPDATE Student SET stu_fname = ?, stu_lname = ?, email = ?, phone_num = ?, NIC = ? WHERE stu_id = ?";
  db.query(
    updateQuery,
    [stu_fname, stu_lname, email, phone_num, NIC, stu_id],
    (err, result) => {
      if (err) {
        console.error("Error updating student profile:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Check if the update was successful
        if (result.affectedRows > 0) {
          res.json({ message: "Student profile updated successfully" });
        } else {
          res
            .status(404)
            .json({ error: "Student not found or no changes made" });
        }
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//postman  /update-profile/2
//body part check put
//{
// "stu_fname": "John",
// "stu_lname": "Doe",
// "email": "john.doe@example.com",
//"phone_num": "9876543210",
//"NIC": "A1234567"
//}
