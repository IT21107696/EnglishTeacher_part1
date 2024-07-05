const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database"); // Assuming both files are in the same directory

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if user exists in the database
  db.query(
    "SELECT * FROM Student WHERE verification = 1 AND email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        // User found, login successful
        const stu_id = results[0].stu_id;
        return res.status(200).json({ message: "Login successful", stu_id });
      } else {
        // if (results.length > 0) {
        //   // User found, login successful
        //   return res.json({ message: "Login successful" });
        // } else {
        // User not found or invalid credentials
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
