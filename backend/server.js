const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database error:", err);
    return;
  }
  console.log("Database connected");
});

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});