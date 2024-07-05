// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database"); // Assuming the database.js file is in the same directory

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // API endpoint to calculate Total Amount and insert into Payment table
// app.post("/calculateTotalAmount", (req, res) => {
//   const { stu_id, ssch_id } = req.body;

//   // Get Per Hour Rate from Teacher table
//   const getRateQuery = `SELECT t_hourrate FROM Teacher WHERE t_id = ?`;

//   db.query(getRateQuery, [stu_id], (error, results, fields) => {
//     if (error) {
//       console.error("Error fetching Per Hour Rate:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//       return;
//     }

//     if (results.length === 0) {
//       res.status(404).json({ success: false, message: "Teacher not found" });
//       return;
//     }

//     const perHourRate = results[0].t_hourrate;

//     // Calculate Total Hours from Student_Schedule table using ssch_id
//     const getScheduleQuery = `SELECT start_time, end_time, stu_id FROM Student_Schedule WHERE t_id = ? AND ssch_id = ?`;

//     db.query(
//       getScheduleQuery,
//       [stu_id, ssch_id],
//       (error, scheduleResults, fields) => {
//         if (error) {
//           console.error("Error fetching schedule:", error);
//           res
//             .status(500)
//             .json({ success: false, message: "Internal Server Error" });
//           return;
//         }

//         if (scheduleResults.length === 0) {
//           res
//             .status(404)
//             .json({ success: false, message: "Teacher schedule not found" });
//           return;
//         }

//         const stu_id = scheduleResults[0].stu_id;
//         const startTime = new Date(scheduleResults[0].start_time);
//         const endTime = new Date(scheduleResults[0].end_time);
//         const totalHours = (endTime - startTime) / (1000 * 60 * 60);

//         // Calculate Total Amount
//         const totalAmount = perHourRate * totalHours;

//         // Insert into Payment table
//         const insertPaymentQuery = `INSERT INTO Payment (pay_amount, t_id, stu_id) VALUES (?, ?, ?)`;

//         db.query(
//           insertPaymentQuery,
//           [totalAmount, stu_id, ssch_id],
//           (error, paymentResults, fields) => {
//             if (error) {
//               console.error("Error inserting into Payment table:", error);
//               res
//                 .status(500)
//                 .json({ success: false, message: "Internal Server Error" });
//               return;
//             }

//             res.json({
//               data: {
//                 perHourRate,
//                 totalHours,
//                 totalAmount,
//               },
//             });
//           }
//         );
//       }
//     );
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database"); // Assuming the database.js file is in the same directory

const app = express();
const port = 3000;

app.use(bodyParser.json());

// API endpoint to calculate Total Amount and insert into Payment table
app.post("/calculateTotalAmount", (req, res) => {
  const { t_id, ssch_id } = req.body;

  // Get Per Hour Rate from Teacher table
  const getRateQuery = `SELECT t_hourrate FROM Teacher WHERE t_id = ?`;

  db.query(getRateQuery, [t_id], (error, results, fields) => {
    if (error) {
      console.error("Error fetching Per Hour Rate:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ success: false, message: "Teacher not found" });
      return;
    }

    const perHourRate = results[0].t_hourrate;

    // Calculate Total Hours from Student_Schedule table using ssch_id
    const getScheduleQuery = `SELECT start_time, end_time, stu_id FROM Student_Schedule WHERE t_id = ? AND ssch_id = ?`;

    db.query(
      getScheduleQuery,
      [t_id, ssch_id],
      (error, scheduleResults, fields) => {
        if (error) {
          console.error("Error fetching schedule:", error);
          res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
          return;
        }

        if (scheduleResults.length === 0) {
          res
            .status(404)
            .json({ success: false, message: "Teacher schedule not found" });
          return;
        }

        const stu_id = scheduleResults[0].stu_id;
        const startTime = new Date(scheduleResults[0].start_time);
        const endTime = new Date(scheduleResults[0].end_time);
        const totalHours = (endTime - startTime) / (1000 * 60 * 60);

        // Calculate Total Amount
        const totalAmount = perHourRate * totalHours;

        // Insert into Payment table
        const insertPaymentQuery = `INSERT INTO Payment (pay_amount, t_id, stu_id) VALUES (?, ?, ?)`;

        db.query(
          insertPaymentQuery,
          [totalAmount, t_id, stu_id],
          (error, paymentResults, fields) => {
            if (error) {
              console.error("Error inserting into Payment table:", error);
              res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
              return;
            }

            res.json({
              data: {
                perHourRate,
                totalHours,
                totalAmount,
              },
            });
          }
        );
      }
    );
  });
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

// // API endpoint to calculate Total Amount
// app.post("/calculateTotalAmount", (req, res) => {
//   const { t_id, ssch_id } = req.body;

//   // Get Per Hour Rate from Teacher table
//   const getRateQuery = `SELECT t_hourrate FROM Teacher WHERE t_id = ?`;

//   db.query(getRateQuery, [t_id], (error, results, fields) => {
//     if (error) {
//       console.error("Error fetching Per Hour Rate:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//       return;
//     }

//     if (results.length === 0) {
//       res.status(404).json({ success: false, message: "Teacher not found" });
//       return;
//     }

//     const perHourRate = results[0].t_hourrate;

//     // Calculate Total Hours from Student_Schedule table using ssch_id
//     const getScheduleQuery = `SELECT start_time, end_time FROM Student_Schedule WHERE t_id = ? AND ssch_id = ?`;

//     db.query(
//       getScheduleQuery,
//       [t_id, ssch_id],
//       (error, scheduleResults, fields) => {
//         if (error) {
//           console.error("Error fetching schedule:", error);
//           res
//             .status(500)
//             .json({ success: false, message: "Internal Server Error" });
//           return;
//         }

//         if (scheduleResults.length === 0) {
//           res
//             .status(404)
//             .json({ success: false, message: "Teacher schedule not found" });
//           return;
//         }

//         const startTime = new Date(scheduleResults[0].start_time);
//         const endTime = new Date(scheduleResults[0].end_time);
//         const totalHours = (endTime - startTime) / (1000 * 60 * 60);

//         // Calculate Total Amount
//         const totalAmount = perHourRate * totalHours;

//         res.json({
//           data: {
//             perHourRate,
//             totalHours,
//             totalAmount,
//           },
//         });
//       }
//     );
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

// // API endpoint to calculate Total Amount
// app.post("/calculateTotalAmount", (req, res) => {
//   const { t_id } = req.body;

//   // Get Per Hour Rate from Teacher table
//   const getRateQuery = `SELECT t_hourrate FROM Teacher WHERE t_id = ?`;
//   console.log(getRateQuery);
//   db.query(getRateQuery, [t_id], (error, results, fields) => {
//     if (error) {
//       console.error("Error fetching Per Hour Rate:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//       return;
//     }

//     if (results.length === 0) {
//       res.status(404).json({ success: false, message: "Teacher not found" });
//       return;
//     }

//     const perHourRate = results[0].t_hourrate;

//     // Calculate Total Hours from Student_Schedule table
//     const getScheduleQuery = `SELECT start_time, end_time FROM Student_Schedule WHERE t_id = ?`;
//     db.query(getScheduleQuery, [t_id], (error, scheduleResults, fields) => {
//       if (error) {
//         console.error("Error fetching schedule:", error);
//         res
//           .status(500)
//           .json({ success: false, message: "Internal Server Error" });
//         return;
//       }

//       if (scheduleResults.length === 0) {
//         res
//           .status(404)
//           .json({ success: false, message: "Teacher schedule not found" });
//         return;
//       }

//       // const startTime = new Date(scheduleResults[0].start_time).toISOString();
//       // const endTime = new Date(scheduleResults[0].end_time).toISOString();
//       // const totalHours =
//       //   (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);

//       // Calculate Total Hours
//       const startTime = new Date(scheduleResults[0].start_time);
//       const endTime = new Date(scheduleResults[0].end_time);
//       const totalHours = (endTime - startTime) / (1000 * 60 * 60);
//       console.log("start", startTime);
//       // Calculate Total Amount
//       const totalAmount = perHourRate * totalHours;

//       res.json({
//         success: true,
//         data: {
//           perHourRate,
//           totalHours,
//           totalAmount,
//         },
//       });
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./database");

// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

// // API endpoint to calculate Total Amount
// app.post("/calculateTotalAmount", (req, res) => {
//   const { stu_id } = req.body; // Change t_id to stu_id

//   // Get Per Hour Rate from Teacher table (assuming stu_id is in the Teacher table)
//   const getRateQuery = `SELECT t_hourrate FROM Teacher WHERE stu_id = ?`; // Change t_id to stu_id

//   db.query(getRateQuery, [stu_id], (error, results, fields) => {
//     if (error) {
//       console.error("Error fetching Per Hour Rate:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error" });
//       return;
//     }

//     if (results.length === 0) {
//       res.status(404).json({ success: false, message: "Teacher not found" });
//       return;
//     }

//     const perHourRate = results[0].t_hourrate;

//     // Calculate Total Hours from Student_Schedule table
//     const getScheduleQuery = `SELECT start_time, end_time FROM Student_Schedule WHERE stu_id = ?`; // Change t_id to stu_id

//     db.query(getScheduleQuery, [stu_id], (error, scheduleResults, fields) => {
//       if (error) {
//         console.error("Error fetching schedule:", error);
//         res
//           .status(500)
//           .json({ success: false, message: "Internal Server Error" });
//         return;
//       }

//       if (scheduleResults.length === 0) {
//         res
//           .status(404)
//           .json({ success: false, message: "Student schedule not found" });
//         return;
//       }

//       const startTime = new Date(scheduleResults[0].start_time);
//       const endTime = new Date(scheduleResults[0].end_time);
//       const totalHours = (endTime - startTime) / (1000 * 60 * 60);

//       // Calculate Total Amount
//       const totalAmount = perHourRate * totalHours;

//       res.json({
//         success: true,
//         data: {
//           perHourRate,
//           totalHours,
//           totalAmount,
//         },
//       });
//     });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
