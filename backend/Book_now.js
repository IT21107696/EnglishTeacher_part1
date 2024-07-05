const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database"); // Assuming the database.js file is in the same directory

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to create a new schedule
app.post("/api/Student_Schedule", (req, res) => {
  const {
    booked_date,
    schedule_date,
    start_time,
    end_time,
    t_id,
    stu_id,
    tsch_id,
  } = req.body;

  // If booked_date is not provided, set it to the current date
  const actualBookedDate = booked_date
    ? booked_date
    : new Date().toISOString().split("T")[0];

  // Check if the selected date and time by the student exist in Teacher_Schedule
  db.query(
    "SELECT tsch_id, schedule_date, start_time, end_time, t_id, status FROM Teacher_Schedule WHERE schedule_date = ? AND start_time = ? AND end_time = ? AND t_id = ? AND status = 0",
    [schedule_date, start_time, end_time, t_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.length === 0) {
        // If no match found in Teacher_Schedule
        res.status(400).json({
          error: "Invalid selection. Selected time and date not available.",
        });
      } else {
        const teacherSchedule = results[0];

        // Update the status in Teacher_Schedule to 1
        db.query(
          "UPDATE Teacher_Schedule SET status = 1 WHERE tsch_id = ?",
          [teacherSchedule.tsch_id], // Corrected from teacherSchedule.id
          (error, updateResults) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: "Internal Server Error" });
            } else {
              // Insert the data into the Student_Schedule table
              db.query(
                "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id, stu_id, tsch_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  actualBookedDate,
                  teacherSchedule.schedule_date,
                  teacherSchedule.start_time,
                  teacherSchedule.end_time,
                  t_id,
                  stu_id,
                  teacherSchedule.tsch_id, // Corrected from teacherSchedule.id
                ],
                (error, insertResults) => {
                  if (error) {
                    console.error(error);
                    res.status(500).json({ error: "Internal Server Error" });
                  } else {
                    res
                      .status(201)
                      .json({ message: "Schedule created successfully" });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const {
//     booked_date,
//     schedule_date,
//     start_time,
//     end_time,
//     t_id,
//     stu_id,
//     tsch_id,
//   } = req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the selected date and time by the student exist in Teacher_Schedule
//   db.query(
//     "SELECT tsch_id, schedule_date, start_time, end_time, t_id, status FROM Teacher_Schedule WHERE schedule_date = ? AND start_time = ? AND end_time = ? AND t_id = ? AND status = 0",
//     [schedule_date, start_time, end_time, t_id],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else if (results.length === 0) {
//         // If no match found in Teacher_Schedule
//         res.status(400).json({
//           error: "Invalid selection. Selected time and date not available.",
//         });
//       } else {
//         const teacherSchedule = results[0];

//         // Update the status in Teacher_Schedule to 1
//         db.query(
//           "UPDATE Teacher_Schedule SET status = 1 WHERE tsch_id = ?",
//           [teacherSchedule.id],
//           (error, updateResults) => {
//             if (error) {
//               console.error(error);
//               res.status(500).json({ error: "Internal Server Error" });
//             } else {
//               // Insert the data into the Student_Schedule table
//               db.query(
//                 "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id, stu_id, tsch_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
//                 [
//                   actualBookedDate,
//                   teacherSchedule.schedule_date,
//                   teacherSchedule.start_time,
//                   teacherSchedule.end_time,
//                   t_id,
//                   stu_id,
//                   teacherSchedule.id,
//                 ],
//                 (error, insertResults) => {
//                   if (error) {
//                     console.error(error);
//                     res.status(500).json({ error: "Internal Server Error" });
//                   } else {
//                     res
//                       .status(201)
//                       .json({ message: "Schedule created successfully" });
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const { booked_date, schedule_date, start_time, end_time, t_id, stu_id, tsch_id  } =
//     req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the selected date and time by the student exist in Teacher_Schedule
//   db.query(
//     "SELECT * FROM Teacher_Schedule WHERE schedule_date = ? AND start_time = ? AND end_time = ? AND t_id = ? tsch_id = ? AND status = 0",
//     [schedule_date, start_time, end_time, t_id, tsch_id ],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else if (results.length === 0) {
//         // If no match found in Teacher_Schedule
//         res.status(400).json({
//           error: "Invalid selection. Selected time and date not available.",
//         });
//       } else {
//         const t_id = results[0].id; // Assuming 'id' is the primary key of Teacher_Schedule

//         // Update the status in Teacher_Schedule to 1
//         db.query(
//           "UPDATE Teacher_Schedule SET status = 1 WHERE t_id = ?",
//           [t_id],
//           (error, updateResults) => {
//             if (error) {
//               console.error(error);
//               res.status(500).json({ error: "Internal Server Error" });
//             } else {
//               // Insert the data into the Student_Schedule table
//               db.query(
//                 "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id, stu_id) VALUES (?, ?, ?, ?, ?, ?)",
//                 [
//                   actualBookedDate,
//                   schedule_date,
//                   start_time,
//                   end_time,
//                   t_id,
//                   stu_id,
//                   //tsch_id,
//                 ],
//                 (error, insertResults) => {
//                   if (error) {
//                     console.error(error);
//                     res.status(500).json({ error: "Internal Server Error" });
//                   } else {
//                     res
//                       .status(201)
//                       .json({ message: "Schedule created successfully" });
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const { booked_date, schedule_date, start_time, end_time, t_id } = req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the provided t_id exists in the Teacher table
//   connection.query(
//     "SELECT * FROM Teacher WHERE t_id = ?",
//     [t_id],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else if (results.length === 0) {
//         // If the provided t_id does not exist in Teacher table
//         res.status(400).json({ error: "Invalid t_id. Teacher not found." });
//       } else {
//         // Insert the data into the database
//         connection.query(
//           "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id) VALUES (?, ?, ?, ?, ?)",
//           [actualBookedDate, schedule_date, start_time, end_time, t_id],
//           (error, results) => {
//             if (error) {
//               console.error(error);
//               res.status(500).json({ error: "Internal Server Error" });
//             } else {
//               res
//                 .status(201)
//                 .json({ message: "Schedule created successfully" });
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const { booked_date, schedule_date, start_time, end_time, t_id } = req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the provided t_id exists in the Teacher table
//   db.query("SELECT * FROM Teacher WHERE t_id = ?", [t_id], (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else if (results.length === 0) {
//       // If the provided t_id does not exist in Teacher table
//       res.status(400).json({ error: "Invalid t_id. Teacher not found." });
//     } else {
//       // Insert the data into the database
//       db.query(
//         "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id) VALUES (?, ?, ?, ?, ?)",
//         [actualBookedDate, schedule_date, start_time, end_time, t_id],
//         (error, results) => {
//           if (error) {
//             console.error(error);
//             res.status(500).json({ error: "Internal Server Error" });
//           } else {
//             res.status(201).json({ message: "Schedule created successfully" });
//           }
//         }
//       );
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const { booked_date, schedule_date, start_time, end_time, t_id } = req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the selected date and time by the student exist in Teacher_Schedule
//   db.query(
//     "SELECT * FROM Teacher_Schedule WHERE schedule_date = ? AND start_time = ? AND end_time = ? AND t_id = ? ",
//     [schedule_date, start_time, end_time, t_id],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else if (results.length === 0) {
//         // If no match found in Teacher_Schedule
//         res.status(400).json({
//           error: "Invalid selection. Selected time and date not available.",
//         });
//       } else {
//         // Insert the data into the Student_Schedule table
//         db.query(
//           "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id) VALUES (?, ?, ?, ?, ?)",
//           [actualBookedDate, schedule_date, start_time, end_time, t_id],
//           (error, results) => {
//             if (error) {
//               console.error(error);
//               res.status(500).json({ error: "Internal Server Error" });
//             } else {
//               res
//                 .status(201)
//                 .json({ message: "Schedule created successfully" });
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const { booked_date, schedule_date, start_time, end_time, t_id, stu_id } =
//     req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the selected date and time by the student exist in Teacher_Schedule
//   db.query(
//     "SELECT * FROM Teacher_Schedule WHERE schedule_date = ? AND start_time = ? AND end_time = ? AND t_id = ?",
//     [schedule_date, start_time, end_time, t_id],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else if (results.length === 0) {
//         // If no match found in Teacher_Schedule
//         res.status(400).json({
//           error: "Invalid selection. Selected time and date not available.",
//         });
//       } else {
//         const tsch_id = results[0].id; // Assuming 'id' is the primary key of Teacher_Schedule

//         // Insert the data into the Student_Schedule table
//         db.query(
//           "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id, stu_id, tsch_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
//           [
//             actualBookedDate,
//             schedule_date,
//             start_time,
//             end_time,
//             t_id,
//             stu_id,
//             tsch_id,
//           ],
//           (error, results) => {
//             if (error) {
//               console.error(error);
//               res.status(500).json({ error: "Internal Server Error" });
//             } else {
//               res
//                 .status(201)
//                 .json({ message: "Schedule created successfully" });
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Endpoint to create a new schedule
// app.post("/api/Student_Schedule", (req, res) => {
//   const { booked_date, schedule_date, start_time, end_time, t_id, stu_id } =
//     req.body;

//   // If booked_date is not provided, set it to the current date
//   const actualBookedDate = booked_date
//     ? booked_date
//     : new Date().toISOString().split("T")[0];

//   // Check if the selected date and time by the student exist in Teacher_Schedule
//   db.query(
//     "SELECT * FROM Teacher_Schedule WHERE schedule_date = ? AND start_time = ? AND end_time = ? AND t_id = ? AND status = 1",
//     [schedule_date, start_time, end_time, t_id],
//     (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else if (results.length === 0) {
//         // If no match found in Teacher_Schedule
//         res.status(400).json({
//           error: "Invalid selection. Selected time and date not available.",
//         });
//       } else {
//         const tsch_id = results[0].id; // Assuming 'id' is the primary key of Teacher_Schedule

//         // Insert the data into the Student_Schedule table with status = 0
//         db.query(
//           "INSERT INTO Student_Schedule (booked_date, schedule_date, start_time, end_time, t_id, stu_id, tsch_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, 0)",
//           [
//             actualBookedDate,
//             schedule_date,
//             start_time,
//             end_time,
//             t_id,
//             stu_id,
//             tsch_id,
//           ],
//           (error, results) => {
//             if (error) {
//               console.error(error);
//               res.status(500).json({ error: "Internal Server Error" });
//             } else {
//               // Update the status in Teacher_Schedule to 0
//               db.query(
//                 "UPDATE Teacher_Schedule SET status = 0 WHERE id = ?",
//                 [tsch_id],
//                 (error, updateResults) => {
//                   if (error) {
//                     console.error(error);
//                     res.status(500).json({ error: "Internal Server Error" });
//                   } else {
//                     // Update the status in Student_Schedule to 1
//                     db.query(
//                       "UPDATE Student_Schedule SET status = 1 WHERE tsch_id = ?",
//                       [tsch_id],
//                       (error, studentUpdateResults) => {
//                         if (error) {
//                           console.error(error);
//                           res
//                             .status(500)
//                             .json({ error: "Internal Server Error" });
//                         } else {
//                           res
//                             .status(201)
//                             .json({ message: "Schedule created successfully" });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// {
//   "schedule_date": "2024-02-10",
//   "start_time": "10:00:00",
//   "end_time": "12:00:00",
//   "t_id": 2,
//   "stu_id": 6,
//   "tsch_id": 4
// }
