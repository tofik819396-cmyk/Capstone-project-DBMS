# AI-Based Student Performance & Academic Analytics System

## Project Overview
The AI-Based Student Performance & Academic Analytics System is a web-based academic analytics project designed to organize student records and analyze academic performance using marks, CGPA, and attendance data.

The system provides a dashboard to help users understand student performance and identify records that may need academic attention.

## Objectives
- Store student, subject, marks, and attendance records.
- Display student information through a web dashboard.
- Calculate average CGPA and marks percentages.
- Analyze attendance percentages.
- Identify top performers based on CGPA.
- Flag records with low marks or attendance for further review.

## Features
1. Student records dashboard
2. Student search by name or department
3. Average CGPA calculation
4. Subject-wise marks analysis
5. Attendance percentage analysis
6. Student performance charts
7. Rule-based academic risk indicators

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Database Connector: mysql2
- API Communication: REST APIs

## Project Structure

```text
student-analytics/
├── backend/
│   ├── server.js
│   └── db.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   ├── schema.sql
│   └── sample_data.sql
├── package.json
└── README.md
```

## Setup Instructions

1. Install Node.js and MySQL.
2. Create the `student_analytics` database and tables using `database/schema.sql`.
3. Insert demonstration records using `database/sample_data.sql`.
4. Install project dependencies:

   ```bash
   npm install
   ```

5. Configure the MySQL credentials in `backend/db.js`.
6. Start the backend:

   ```bash
   node backend/server.js
   ```

7. Open `frontend/index.html` with the VS Code Live Server extension.
8. Keep the backend and MySQL server running while using the dashboard.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check backend status |
| GET | `/api/students` | Retrieve student records |
| GET | `/api/subjects` | Retrieve subjects |
| GET | `/api/marks` | Retrieve marks analysis |
| GET | `/api/attendance` | Retrieve attendance analysis |

## Academic Risk Analysis
The current version uses rule-based indicators:
- Average marks below 40%: needs attention.
- Attendance below 75%: needs attention.
- Otherwise: on track.

These are demonstration rules and should be adjusted to institutional policies. The system does not make final academic decisions.

## Future Scope
- Secure login for authorized users
- Add, update, and delete student records
- More advanced visual analytics
- Historical performance tracking
- Machine-learning-based performance prediction
- Improved input validation and database security

## Limitations
The current project uses sample data and rule-based analysis. It does not yet implement a trained machine-learning model, authentication, or role-based access control.

## Conclusion
This project demonstrates how a web application can connect a MySQL database with a Node.js backend and a frontend dashboard to organize academic records and provide basic performance insights.