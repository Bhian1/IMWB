const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "laundry",
});

app.post("/submitOrder", (req, res) => {
  const { name, orderType, weight, price, deliveryMethod, deliveryAddress } = req.body;

  const sql = "INSERT INTO orders (name, orderType, weight, price, deliveryMethod, deliveryAddress) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [name, orderType, weight, price, deliveryMethod, deliveryAddress];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error submitting order", message: err.message });
    } else {
      res.json("Order submitted successfully");
    }
  });
});

app.listen(8081, () => {
  console.log("Server is listening on port 8081");
});