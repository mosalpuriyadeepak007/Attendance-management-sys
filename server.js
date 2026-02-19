const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Smooth Area Line Chart' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

app.post('/login', (req, res) => {
    const { role, username, password } = req.body;
    // TODO: Add authentication logic here
    console.log(`Login attempt: ${username} as ${role}`);
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
        stats: {
            totalStudents: '1,200',
            presentToday: '95%',
            pendingReports: '5',
            notifications: '3 New'
        }
    });
});

app.get('/faculty', (req, res) => {
    res.render('faculty', { title: 'Faculty' });
});

// Students route
app.get('/students', (req, res) => {
    res.render('students', { 
        title: 'Students',
        students: [
            { id: 'STU001', name: 'John Doe', email: 'john@example.com', department: 'Computer Science', year: '2nd Year', attendance: 92, status: 'active' },
            { id: 'STU002', name: 'Jane Smith', email: 'jane@example.com', department: 'Electronics', year: '3rd Year', attendance: 88, status: 'active' },
            { id: 'STU003', name: 'Mike Johnson', email: 'mike@example.com', department: 'Computer Science', year: '1st Year', attendance: 65, status: 'active' },
            { id: 'STU004', name: 'Sarah Wilson', email: 'sarah@example.com', department: 'Mechanical', year: '4th Year', attendance: 95, status: 'active' },
            { id: 'STU005', name: 'David Brown', email: 'david@example.com', department: 'Civil', year: '2nd Year', attendance: 72, status: 'inactive' }
        ]
    });
});

// Attendance route
app.get('/attendance', (req, res) => {
    res.render('attendance', { 
        title: 'Attendance',
        summary: {
            totalStudents: 120,
            present: 108,
            absent: 8,
            late: 4
        },
        records: [
            { studentId: 'STU001', name: 'John Doe', class: 'CSE - 2nd Year', subject: 'Programming', date: '2026-02-19', timeIn: '09:05', status: 'Present', markedBy: 'Prof. Smith' },
            { studentId: 'STU002', name: 'Jane Smith', class: 'ECE - 3rd Year', subject: 'Electronics', date: '2026-02-19', timeIn: '09:00', status: 'Present', markedBy: 'Prof. Johnson' },
            { studentId: 'STU003', name: 'Mike Johnson', class: 'CSE - 1st Year', subject: 'Mathematics', date: '2026-02-19', timeIn: null, status: 'Absent', markedBy: 'Prof. Davis' },
            { studentId: 'STU004', name: 'Sarah Wilson', class: 'MECH - 4th Year', subject: 'Thermodynamics', date: '2026-02-19', timeIn: '09:20', status: 'Late', markedBy: 'Prof. Wilson' },
            { studentId: 'STU005', name: 'David Brown', class: 'CIVIL - 2nd Year', subject: 'Structures', date: '2026-02-19', timeIn: '09:02', status: 'Present', markedBy: 'Prof. Brown' }
        ]
    });
});

// Reports route
app.get('/reports', (req, res) => {
    res.render('reports', { 
        title: 'Reports',
        recentReports: [
            { id: 'RPT001', name: 'Monthly Attendance Report - January', type: 'Attendance', date: '2026-02-01', generatedBy: 'Admin', status: 'Completed' },
            { id: 'RPT002', name: 'Defaulters List - January', type: 'Defaulters', date: '2026-02-01', generatedBy: 'Admin', status: 'Completed' },
            { id: 'RPT003', name: 'Department Report - CSE', type: 'Department', date: '2026-01-28', generatedBy: 'Admin', status: 'Completed' },
            { id: 'RPT004', name: 'Student Report - Batch 2024', type: 'Student', date: '2026-01-25', generatedBy: 'Admin', status: 'Completed' },
            { id: 'RPT005', name: 'Weekly Summary Report', type: 'Attendance', date: '2026-02-15', generatedBy: 'System', status: 'Pending' }
        ]
    });
});

// Settings route
app.get('/settings', (req, res) => {
    res.render('settings', { 
        title: 'Settings',
        settings: {
            institutionName: 'ABC College of Engineering',
            institutionCode: 'ABCCE',
            address: '123 Education Street, City, State 12345',
            phone: '+1 234 567 8900',
            email: 'admin@abcce.edu',
            academicYear: '2025-2026',
            minAttendance: 75,
            warningThreshold: 80,
            startTime: '09:00',
            endTime: '17:00',
            lateThreshold: 15,
            emailAbsent: true,
            emailLowAttendance: true,
            emailWeeklyReport: false,
            smsAbsent: false,
            smsLate: false
        },
        users: [
            { username: 'admin', email: 'admin@abcce.edu', role: 'admin', status: 'active', lastLogin: '2026-02-19 08:30' },
            { username: 'faculty1', email: 'faculty1@abcce.edu', role: 'faculty', status: 'active', lastLogin: '2026-02-18 14:20' },
            { username: 'staff1', email: 'staff1@abcce.edu', role: 'staff', status: 'inactive', lastLogin: '2026-02-10 09:00' }
        ],
        departments: [
            { name: 'Computer Science', students: 300, faculty: 15 },
            { name: 'Electronics', students: 250, faculty: 12 },
            { name: 'Mechanical', students: 280, faculty: 14 },
            { name: 'Civil', students: 200, faculty: 10 }
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
