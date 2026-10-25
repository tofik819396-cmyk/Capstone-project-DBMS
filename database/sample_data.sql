USE student_analytics;

INSERT INTO students (name, email, department, semester, cgpa)
VALUES
('Aman Sharma', 'aman@example.com', 'CSE', 3, 8.20),
('Priya Verma', 'priya@example.com', 'CSE', 3, 9.10),
('Rahul Kumar', 'rahul@example.com', 'CSE', 3, 7.40),
('Neha Singh', 'neha@example.com', 'CSE', 3, 8.60);

INSERT INTO subjects (subject_name, semester, credits)
VALUES
('DBMS', 3, 4),
('Data Structures', 3, 4),
('Operating Systems', 3, 3);

INSERT INTO marks
(student_id, subject_id, exam_type, marks_obtained, total_marks)
VALUES
(1, 1, 'Midterm', 78, 100),
(2, 1, 'Midterm', 92, 100),
(3, 1, 'Midterm', 65, 100),
(4, 1, 'Midterm', 85, 100),
(1, 2, 'Midterm', 80, 100),
(2, 2, 'Midterm', 95, 100),
(3, 2, 'Midterm', 70, 100),
(4, 2, 'Midterm', 88, 100),
(1, 3, 'Midterm', 75, 100),
(2, 3, 'Midterm', 90, 100),
(3, 3, 'Midterm', 68, 100),
(4, 3, 'Midterm', 86, 100);

INSERT INTO attendance
(student_id, subject_id, total_classes, attended_classes)
VALUES
(1, 1, 30, 27),
(2, 1, 30, 29),
(3, 1, 30, 22),
(4, 1, 30, 28),
(1, 2, 30, 26),
(2, 2, 30, 30),
(3, 2, 30, 23),
(4, 2, 30, 27),
(1, 3, 30, 28),
(2, 3, 30, 29),
(3, 3, 30, 21),
(4, 3, 30, 26);