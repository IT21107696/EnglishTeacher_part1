const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database"); // Assuming the database.js file is in the same directory

const app = express();
const port = 3000;

app.use(bodyParser.json());

// API endpoint to fetch data from Payment and System_Setting tables
app.post("/getPaymentData", (req, res) => {
  const { pay_id } = req.body;

  // Get data from Payment table
  const getPaymentDataQuery = `
    SELECT pay_amount
    FROM Payment
    WHERE pay_id = ?`;

  db.query(getPaymentDataQuery, [pay_id], (error, paymentResults, fields) => {
    if (error) {
      console.error("Error fetching data from Payment table:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
      return;
    }

    if (paymentResults.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
      return;
    }

    const pay_amount = paymentResults[0].pay_amount;

    // Get data from System_Setting table
    const getSystemSettingDataQuery = `
      SELECT company_name, bank_accountNum, bank_name, 	bank_Branch FROM System_Setting WHERE sys_id  = 1`;

    db.query(
      getSystemSettingDataQuery,
      [pay_id],
      (error, systemSettingResults, fields) => {
        if (error) {
          console.error(
            "Error fetching data from System_Setting table:",
            error
          );
          res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
          return;
        }

        if (systemSettingResults.length === 0) {
          res.status(404).json({
            success: false,
            message: "System_Setting record not found",
          });
          return;
        }

        const systemSettingData = {
          Acc_Name: systemSettingResults[0].company_name,
          Acc_No: systemSettingResults[0].bank_accountNum,
          Bank: systemSettingResults[0].bank_name,
          Branch: systemSettingResults[0].bank_Branch,
        };

        res.json({
          success: true,
          data: {
            pay_amount,
            systemSettingData,
          },
        });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
