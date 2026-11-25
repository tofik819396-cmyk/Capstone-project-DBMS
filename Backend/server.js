
// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("K.R. Mangalam University Backend is Running!");
// });

// app.get("/api/students", (req, res) => {
//   const sql = "SELECT * FROM students";

//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         error: err.message
//       });
//     }

//     res.json(results);
//   });
// });

// const PORT = 5000;
// app.get("/api/subjects", (req, res) => {
//   db.query("SELECT * FROM subjects", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     res.json(results);
//   });
// });


// app.get("/api/marks", (req, res) => {
//   const sql = `
//     SELECT
//       s.name AS student_name,
//       sub.subject_name,
//       m.exam_type,
//       m.marks_obtained,
//       m.total_marks,
//       ROUND(
//         m.marks_obtained * 100.0 / m.total_marks, 2
//       ) AS percentage
//     FROM marks m
//     JOIN students s ON m.student_id = s.student_id
//     JOIN subjects sub ON m.subject_id = sub.subject_id
//     ORDER BY s.student_id, sub.subject_id
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     res.json(results);
//   });
// });

// app.get("/api/attendance", (req, res) => {
//   const sql = `
//     SELECT
//       s.name AS student_name,
//       sub.subject_name,
//       a.total_classes,
//       a.attended_classes,
//       ROUND(
//         a.attended_classes * 100.0 / a.total_classes, 2
//       ) AS attendance_percentage
//     FROM attendance a
//     JOIN students s ON a.student_id = s.student_id
//     JOIN subjects sub ON a.subject_id = sub.subject_id
//     ORDER BY s.student_id, sub.subject_id
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     res.json(results);
//   });
// });

// // ADD NEW STUDENT API
// app.post("/api/students", (req, res) => {
//   const { name, email, department, semester, cgpa } = req.body;

//   if (!name || !email || !department || !semester || cgpa === undefined) {
//     return res.status(400).json({
//       message: "Please fill all student details"
//     });
//   }

//   const sql = `
//     INSERT INTO students (name, email, department, semester, cgpa)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [name, email, department, semester, cgpa],
//     (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({
//           message: "Unable to add student",
//           error: err.message
//         });
//       }

//       res.status(201).json({
//         message: "Student added successfully!",
//         studentId: result.insertId
//       });
//     }
//   );
// });

// // EDIT STUDENT API
// app.put("/api/students/:id", (req, res) => {
//   const { name, email, department, semester, cgpa } = req.body;
//   const studentId = req.params.id;

//   if (!name || !email || !department || !semester ||
//       cgpa === undefined || Number(cgpa) < 0 || Number(cgpa) > 10) {
//     return res.status(400).json({
//       message: "Please enter valid student details"
//     });
//   }

//   const sql = `
//     UPDATE students
//     SET name = ?, email = ?, department = ?, semester = ?, cgpa = ?
//     WHERE student_id = ?
//   `;

//   db.query(
//     sql,
//     [name, email, department, semester, cgpa, studentId],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           message: "Student not found"
//         });
//       }

//       res.json({ message: "Student updated successfully!" });
//     }
//   );
// });

// // DELETE STUDENT API
// app.delete("/api/students/:id", (req, res) => {
//   const studentId = req.params.id;

//   db.beginTransaction((err) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     db.query(
//       "DELETE FROM attendance WHERE student_id = ?",
//       [studentId],
//       (err) => {
//         if (err) {
//           return db.rollback(() =>
//             res.status(500).json({ error: err.message })
//           );
//         }

//         db.query(
//           "DELETE FROM marks WHERE student_id = ?",
//           [studentId],
//           (err) => {
//             if (err) {
//               return db.rollback(() =>
//                 res.status(500).json({ error: err.message })
//               );
//             }

//             db.query(
//               "DELETE FROM students WHERE student_id = ?",
//               [studentId],
//               (err, result) => {
//                 if (err) {
//                   return db.rollback(() =>
//                     res.status(500).json({ error: err.message })
//                   );
//                 }

//                 if (result.affectedRows === 0) {
//                   return db.rollback(() =>
//                     res.status(404).json({
//                       message: "Student not found"
//                     })
//                   );
//                 }

//                 db.commit((err) => {
//                   if (err) {
//                     return db.rollback(() =>
//                       res.status(500).json({ error: err.message })
//                     );
//                   }

//                   res.json({
//                     message: "Student deleted successfully!"
//                   });
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// HOME API
app.get("/", (req, res) => {
  res.send("K.R. Mangalam University Backend is Running!");
});

// GET ALL STUDENTS
app.get("/api/students", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL SUBJECTS
app.get("/api/subjects", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM subjects");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MARKS
app.get("/api/marks", async (req, res) => {
  try {
    const sql = `
      SELECT
        s.name AS student_name,
        sub.subject_name,
        m.exam_type,
        m.marks_obtained,
        m.total_marks,
        ROUND(
          m.marks_obtained * 100.0 / NULLIF(m.total_marks, 0), 2
        ) AS percentage
      FROM marks m
      JOIN students s ON m.student_id = s.student_id
      JOIN subjects sub ON m.subject_id = sub.subject_id
      ORDER BY s.student_id, sub.subject_id
    `;

    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ATTENDANCE
app.get("/api/attendance", async (req, res) => {
  try {
    const sql = `
      SELECT
        s.name AS student_name,
        sub.subject_name,
        a.total_classes,
        a.attended_classes,
        ROUND(
          a.attended_classes * 100.0 / NULLIF(a.total_classes, 0), 2
        ) AS attendance_percentage
      FROM attendance a
      JOIN students s ON a.student_id = s.student_id
      JOIN subjects sub ON a.subject_id = sub.subject_id
      ORDER BY s.student_id, sub.subject_id
    `;

    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD STUDENT
app.post("/api/students", async (req, res) => {
  const { name, email, department, semester, cgpa } = req.body;

  if (
    !name || !email || !department ||
    !semester || cgpa === undefined ||
    Number(cgpa) < 0 || Number(cgpa) > 10
  ) {
    return res.status(400).json({
      message: "Please enter valid student details"
    });
  }

  try {
    const sql = `
      INSERT INTO students
      (name, email, department, semester, cgpa)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING student_id
    `;

    const result = await db.query(sql, [
      name, email, department, semester, cgpa
    ]);

    res.status(201).json({
      message: "Student added successfully!",
      studentId: result.rows[0].student_id
    });
  } catch (err) {
    res.status(500).json({
      message: "Unable to add student",
      error: err.message
    });
  }
});

// EDIT STUDENT
app.put("/api/students/:id", async (req, res) => {
  const { name, email, department, semester, cgpa } = req.body;
  const studentId = req.params.id;

  if (
    !name || !email || !department || !semester ||
    cgpa === undefined || Number(cgpa) < 0 ||
    Number(cgpa) > 10
  ) {
    return res.status(400).json({
      message: "Please enter valid student details"
    });
  }

  try {
    const sql = `
      UPDATE students
      SET name = $1,
          email = $2,
          department = $3,
          semester = $4,
          cgpa = $5
      WHERE student_id = $6
    `;

    const result = await db.query(sql, [
      name, email, department, semester, cgpa, studentId
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({ message: "Student updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE STUDENT WITH TRANSACTION
app.delete("/api/students/:id", async (req, res) => {
  const studentId = req.params.id;
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "DELETE FROM attendance WHERE student_id = $1",
      [studentId]
    );

    await client.query(
      "DELETE FROM marks WHERE student_id = $1",
      [studentId]
    );

    const result = await client.query(
      "DELETE FROM students WHERE student_id = $1",
      [studentId]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Student not found"
      });
    }

    await client.query("COMMIT");

    res.json({
      message: "Student deleted successfully!"
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
