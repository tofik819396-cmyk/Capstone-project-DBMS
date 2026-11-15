
async function loadDashboard() {
  const status = document.getElementById("status");
  const table = document.getElementById("studentTable");

  try {
    const response = await fetch(
      "http://localhost:5000/api/students"
    );

    if (!response.ok) {
      throw new Error("Could not load student data");
    }

    const students = await response.json();

    document.getElementById("totalStudents").textContent =
      students.length;

    const average = students.length
      ? students.reduce((sum, student) =>
          sum + Number(student.cgpa), 0) / students.length
      : 0;

    document.getElementById("averageCgpa").textContent =
      average.toFixed(2);

    const subjectResponse = await fetch(
      "http://localhost:5000/api/subjects"
    );

    if (!subjectResponse.ok) {
      throw new Error("Could not load subjects");
    }

    const subjects = await subjectResponse.json();

    document.getElementById("totalSubjects").textContent =
      subjects.length;

   renderStudents(students);

    status.textContent = "Student data loaded successfully.";
  } catch (error) {
    status.textContent =
      error.message + ". Check that the backend and database are running.";
  }
}

loadDashboard();

async function loadAnalytics() {
  try {
    const [marksResponse, attendanceResponse] = await Promise.all([
      fetch("http://localhost:5000/api/marks"),
      fetch("http://localhost:5000/api/attendance")
    ]);

    if (!marksResponse.ok || !attendanceResponse.ok) {
      throw new Error("Could not load analytics");
    }

    const marks = await marksResponse.json();
    const attendance = await attendanceResponse.json();

    const marksTable = document.getElementById("marksTable");
    const attendanceTable = document.getElementById("attendanceTable");

    marksTable.innerHTML = "";
    attendanceTable.innerHTML = "";

    marks.forEach((item) => {
      const row = document.createElement("tr");

      [
        item.student_name,
        item.subject_name,
        item.exam_type,
        `${item.marks_obtained} / ${item.total_marks}`,
        `${item.percentage}%`
      ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      marksTable.appendChild(row);
    });

    attendance.forEach((item) => {
      const row = document.createElement("tr");

      [
        item.student_name,
        item.subject_name,
        item.attended_classes,
        item.total_classes,
        `${item.attendance_percentage}%`
      ].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      attendanceTable.appendChild(row);
    });
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

loadAnalytics();

let allStudents = [];
let allAttendance = [];

function renderStudents(students) {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");

    [
      student.student_id,
      student.name,
      student.email,
      student.department,
      student.semester,
      student.cgpa
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value ?? "-";
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");

    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => {
      editStudent(student);
    });

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => {
      deleteStudent(student.student_id, student.name);
    });

    actionCell.append(editButton, deleteButton);
    row.appendChild(actionCell);
    table.appendChild(row);
  });
}

async function loadExtraFeatures() {
  try {
    const [studentsResponse, attendanceResponse] = await Promise.all([
      fetch("http://localhost:5000/api/students"),
      fetch("http://localhost:5000/api/attendance")
    ]);

    if (!studentsResponse.ok || !attendanceResponse.ok) {
      throw new Error("Could not load student analytics");
    }

    allStudents = await studentsResponse.json();
    allAttendance = await attendanceResponse.json();

    // Search students by name or department
    document.getElementById("studentSearch").addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase().trim();

      const filtered = allStudents.filter((student) =>
        student.name.toLowerCase().includes(query) ||
        (student.department || "").toLowerCase().includes(query)
      );

      renderStudents(filtered);
    });

    // Top performer based on highest CGPA
    if (allStudents.length > 0) {
      const top = [...allStudents].sort(
        (a, b) => Number(b.cgpa) - Number(a.cgpa)
      )[0];

      document.getElementById("topPerformer").textContent =
        `${top.name} (${Number(top.cgpa).toFixed(2)})`;
    } else {
      document.getElementById("topPerformer").textContent = "No data";
    }

    // Count attendance records below 75%
    const lowRecords = allAttendance.filter(
      (item) => Number(item.attendance_percentage) < 75
    );

    document.getElementById("lowAttendance").textContent =
      lowRecords.length;

  } catch (error) {
    console.error("Extra features error:", error);
  }
}

loadExtraFeatures();

async function loadPerformanceInsights() {
  try {
    const [marksResponse, attendanceResponse] = await Promise.all([
      fetch("http://localhost:5000/api/marks"),
      fetch("http://localhost:5000/api/attendance")
    ]);

    if (!marksResponse.ok || !attendanceResponse.ok) {
      throw new Error("Unable to load analysis data");
    }

    const marks = await marksResponse.json();
    const attendance = await attendanceResponse.json();

    const performance = {};

    marks.forEach((item) => {
      const name = item.student_name;

      if (!performance[name]) {
        performance[name] = { total: 0, count: 0 };
      }

      performance[name].total += Number(item.percentage);
      performance[name].count += 1;
    });

    const chart = document.getElementById("performanceChart");
    const riskTable = document.getElementById("riskTable");

    chart.innerHTML = "";
    riskTable.innerHTML = "";

    Object.entries(performance).forEach(([name, data]) => {
      const average = data.total / data.count;

      // Draw performance bar
      const row = document.createElement("div");
      row.className = "chart-row";

      const label = document.createElement("span");
      label.className = "chart-name";
      label.textContent = name;

      const track = document.createElement("div");
      track.className = "chart-track";

      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.style.width = `${Math.min(100, Math.max(0, average))}%`;

      track.appendChild(bar);

      const value = document.createElement("span");
      value.className = "chart-value";
      value.textContent = `${average.toFixed(1)}%`;

      row.append(label, track, value);
      chart.appendChild(row);

      // Calculate average attendance for this student
      const studentAttendance = attendance.filter(
        (item) => item.student_name === name
      );

      const totalClasses = studentAttendance.reduce(
        (sum, item) => sum + Number(item.total_classes), 0
      );

      const attendedClasses = studentAttendance.reduce(
        (sum, item) => sum + Number(item.attended_classes), 0
      );

      const attendancePercentage = totalClasses > 0
        ? attendedClasses * 100 / totalClasses
        : null;

      const needsAttention =
        average < 40 ||
        (attendancePercentage !== null && attendancePercentage < 75);

      const tr = document.createElement("tr");

      [
        name,
        `${average.toFixed(1)}%`,
        attendancePercentage === null
          ? "No data"
          : `${attendancePercentage.toFixed(1)}%`,
        needsAttention ? "Needs Attention" : "On Track"
      ].forEach((text) => {
        const td = document.createElement("td");
        td.textContent = text;

        if (needsAttention) {
          td.className = "warning";
        }

        tr.appendChild(td);
      });

      riskTable.appendChild(tr);
    });

    if (Object.keys(performance).length === 0) {
      chart.textContent = "No marks data available.";
    }

  } catch (error) {
    console.error("Performance analysis error:", error);
  }
}

loadPerformanceInsights();

// ADD STUDENT FORM
document.getElementById("studentForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const student = {
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    department: document.getElementById("studentDepartment").value.trim(),
    semester: Number(document.getElementById("studentSemester").value),
    cgpa: Number(document.getElementById("studentCgpa").value)
  };

  try {
    const response = await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to add student");
    }

    alert(result.message);
    document.getElementById("studentForm").reset();

    loadDashboard();

  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);
  }
});

// EDIT STUDENT
async function editStudent(student) {
  const name = prompt("Enter student name:", student.name);
  if (name === null) return;

  const email = prompt("Enter student email:", student.email);
  if (email === null) return;

  const department = prompt("Enter department:", student.department);
  if (department === null) return;

  const semester = prompt("Enter semester:", student.semester);
  if (semester === null) return;

  const cgpa = prompt("Enter CGPA:", student.cgpa);
  if (cgpa === null) return;

  const updatedStudent = {
    name: name.trim(),
    email: email.trim(),
    department: department.trim(),
    semester: Number(semester),
    cgpa: Number(cgpa)
  };

  if (
    !updatedStudent.name ||
    !updatedStudent.email ||
    !updatedStudent.department ||
    !Number.isInteger(updatedStudent.semester) ||
    updatedStudent.semester < 1 ||
    !Number.isFinite(updatedStudent.cgpa) ||
    updatedStudent.cgpa < 0 ||
    updatedStudent.cgpa > 10
  ) {
    alert("Please enter valid student details.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${student.student_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudent)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || "Update failed");
    }

    alert(result.message);

    await loadDashboard();
    await loadExtraFeatures();

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// DELETE STUDENT
async function deleteStudent(id, name) {
  const confirmDelete = confirm(
    `Are you sure you want to delete ${name}?`
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${id}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error);
    }

    alert(result.message);

    // Refresh all dashboard data
    location.reload();

  } catch (error) {
    alert("Error: " + error.message);
    console.error(error);
  }
}