
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Analytics Backend is Running!");
});

app.get("/api/students", (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(results);
  });
});

const PORT = 5000;
app.get("/api/subjects", (req, res) => {
  db.query("SELECT * FROM subjects", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


app.get("/api/marks", (req, res) => {
  const sql = `
    SELECT
      s.name AS student_name,
      sub.subject_name,
      m.exam_type,
      m.marks_obtained,
      m.total_marks,
      ROUND(
        m.marks_obtained * 100.0 / m.total_marks, 2
      ) AS percentage
    FROM marks m
    JOIN students s ON m.student_id = s.student_id
    JOIN subjects sub ON m.subject_id = sub.subject_id
    ORDER BY s.student_id, sub.subject_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

app.get("/api/attendance", (req, res) => {
  const sql = `
    SELECT
      s.name AS student_name,
      sub.subject_name,
      a.total_classes,
      a.attended_classes,
      ROUND(
        a.attended_classes * 100.0 / a.total_classes, 2
      ) AS attendance_percentage
    FROM attendance a
    JOIN students s ON a.student_id = s.student_id
    JOIN subjects sub ON a.subject_id = sub.subject_id
    ORDER BY s.student_id, sub.subject_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
