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
    
    // Redirect based on role
    if (role === 'admin') {
        res.redirect('/dashboard');
    } else {
        res.redirect('/faculty/dashboard');
    }
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

// Profile route
app.get('/profile', (req, res) => {
    res.render('profile', {
        title: 'My Profile',
        user: {
            name: 'Admin User',
            email: 'admin@abcce.edu',
            phone: '+1 234 567 8900',
            department: 'Administration',
            role: 'admin',
            loginCount: 156,
            daysActive: 45
        },
        activities: [
            { type: 'login', icon: 'login', description: 'Logged in from Chrome on Windows', time: '2 hours ago' },
            { type: 'attendance', icon: 'fact_check', description: 'Viewed attendance report for CSE Dept', time: '3 hours ago' },
            { type: 'report', icon: 'description', description: 'Generated monthly attendance report', time: 'Yesterday' },
            { type: 'settings', icon: 'settings', description: 'Updated notification settings', time: '2 days ago' },
            { type: 'login', icon: 'login', description: 'Logged in from Mobile App', time: '3 days ago' }
        ]
    });
});

app.get('/faculty', (req, res) => {
    res.render('faculty', { 
        title: 'Faculty',
        faculty: [
            { 
                id: 'FAC001', 
                name: 'Dr. John Smith', 
                email: 'john.smith@abcce.edu', 
                phone: '+1 234 567 8901',
                department: 'Computer Science', 
                designation: 'Professor',
                subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
                joiningDate: '2020-01-15',
                status: 'active'
            },
            { 
                id: 'FAC002', 
                name: 'Prof. Sarah Johnson', 
                email: 'sarah.j@abcce.edu', 
                phone: '+1 234 567 8902',
                department: 'Electronics', 
                designation: 'Associate Professor',
                subjects: ['Digital Electronics', 'Signal Processing'],
                joiningDate: '2019-06-20',
                status: 'active'
            },
            { 
                id: 'FAC003', 
                name: 'Dr. Michael Brown', 
                email: 'michael.b@abcce.edu', 
                phone: '+1 234 567 8903',
                department: 'Mechanical', 
                designation: 'Assistant Professor',
                subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design'],
                joiningDate: '2021-03-10',
                status: 'on-leave'
            },
            { 
                id: 'FAC004', 
                name: 'Prof. Emily Davis', 
                email: 'emily.d@abcce.edu', 
                phone: '+1 234 567 8904',
                department: 'Civil', 
                designation: 'Professor',
                subjects: ['Structural Analysis', 'Concrete Technology'],
                joiningDate: '2018-08-01',
                status: 'active'
            },
            { 
                id: 'FAC005', 
                name: 'Dr. Robert Wilson', 
                email: 'robert.w@abcce.edu', 
                phone: '+1 234 567 8905',
                department: 'Computer Science', 
                designation: 'Associate Professor',
                subjects: ['Operating Systems', 'Computer Networks', 'Cloud Computing'],
                joiningDate: '2017-07-15',
                status: 'active'
            },
            { 
                id: 'FAC006', 
                name: 'Prof. Lisa Chen', 
                email: 'lisa.c@abcce.edu', 
                phone: '+1 234 567 8906',
                department: 'Mathematics', 
                designation: 'Professor',
                subjects: ['Calculus', 'Linear Algebra', 'Probability & Statistics'],
                joiningDate: '2016-01-10',
                status: 'active'
            },
            { 
                id: 'FAC007', 
                name: 'Dr. James Taylor', 
                email: 'james.t@abcce.edu', 
                phone: '+1 234 567 8907',
                department: 'Physics', 
                designation: 'Assistant Professor',
                subjects: ['Engineering Physics', 'Quantum Mechanics'],
                joiningDate: '2022-09-01',
                status: 'active'
            },
            { 
                id: 'FAC008', 
                name: 'Prof. Amanda Martinez', 
                email: 'amanda.m@abcce.edu', 
                phone: '+1 234 567 8908',
                department: 'Electronics', 
                designation: 'Lecturer',
                subjects: ['VLSI Design', 'Embedded Systems'],
                joiningDate: '2023-01-15',
                status: 'inactive'
            }
        ]
    });
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

// =====================
// FACULTY ROUTES
// =====================

// Faculty Dashboard
app.get('/faculty/dashboard', (req, res) => {
    res.render('faculty/dashboard', {
        title: 'Faculty Dashboard',
        faculty: {
            name: 'Prof. Smith',
            department: 'Computer Science'
        },
        stats: {
            totalClasses: 4,
            totalStudents: 120,
            pendingAttendance: 2,
            markedToday: 2
        },
        schedule: [
            { time: '09:00 AM', subject: 'Data Structures', class: 'CSE - 2nd Year', room: '201', attendanceMarked: true },
            { time: '11:00 AM', subject: 'Programming', class: 'CSE - 1st Year', room: '102', attendanceMarked: true },
            { time: '02:00 PM', subject: 'Database', class: 'CSE - 3rd Year', room: '301', attendanceMarked: false },
            { time: '04:00 PM', subject: 'Algorithms', class: 'CSE - 2nd Year', room: '201', attendanceMarked: false }
        ],
        recentRecords: [
            { date: '2026-02-19', class: 'CSE - 2nd Year', subject: 'Data Structures', present: 28, absent: 2, percentage: 93 },
            { date: '2026-02-19', class: 'CSE - 1st Year', subject: 'Programming', present: 30, absent: 5, percentage: 86 },
            { date: '2026-02-18', class: 'CSE - 3rd Year', subject: 'Database', present: 25, absent: 3, percentage: 89 },
            { date: '2026-02-18', class: 'CSE - 2nd Year', subject: 'Algorithms', present: 27, absent: 3, percentage: 90 }
        ]
    });
});

// Faculty Attendance Page
app.get('/faculty/attendance', (req, res) => {
    res.render('faculty/attendance', {
        title: 'Mark Attendance',
        classes: [
            { id: 'cse-1', name: 'CSE - 1st Year' },
            { id: 'cse-2', name: 'CSE - 2nd Year' },
            { id: 'cse-3', name: 'CSE - 3rd Year' }
        ],
        subjects: [
            { id: 'ds', name: 'Data Structures' },
            { id: 'prog', name: 'Programming' },
            { id: 'db', name: 'Database' },
            { id: 'algo', name: 'Algorithms' }
        ],
        selectedClass: req.query.class || '',
        selectedSubject: req.query.subject || '',
        students: [
            { rollNo: 'CSE001', name: 'John Doe' },
            { rollNo: 'CSE002', name: 'Jane Smith' },
            { rollNo: 'CSE003', name: 'Mike Johnson' },
            { rollNo: 'CSE004', name: 'Sarah Wilson' },
            { rollNo: 'CSE005', name: 'David Brown' },
            { rollNo: 'CSE006', name: 'Emily Davis' },
            { rollNo: 'CSE007', name: 'Chris Lee' },
            { rollNo: 'CSE008', name: 'Anna Taylor' },
            { rollNo: 'CSE009', name: 'Robert Martin' },
            { rollNo: 'CSE010', name: 'Lisa Anderson' }
        ]
    });
});

// Save Attendance
app.post('/faculty/attendance/save', (req, res) => {
    console.log('Attendance saved:', req.body);
    // TODO: Save attendance to database
    res.redirect('/faculty/dashboard');
});

// Faculty Courses Page
app.get('/faculty/courses', (req, res) => {
    res.render('faculty/courses', {
        title: 'My Courses',
        courses: [
            {
                id: 'ds',
                code: 'CS201',
                name: 'Data Structures',
                department: 'Computer Science',
                semester: '3',
                students: 35,
                schedule: 'Mon, Wed 9:00 AM',
                progress: 65,
                color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                icon: 'account_tree',
                classId: 'cse-2'
            },
            {
                id: 'prog',
                code: 'CS101',
                name: 'Programming Fundamentals',
                department: 'Computer Science',
                semester: '1',
                students: 42,
                schedule: 'Tue, Thu 11:00 AM',
                progress: 72,
                color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                icon: 'code',
                classId: 'cse-1'
            },
            {
                id: 'db',
                code: 'CS301',
                name: 'Database Management',
                department: 'Computer Science',
                semester: '5',
                students: 28,
                schedule: 'Mon, Fri 2:00 PM',
                progress: 45,
                color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                icon: 'storage',
                classId: 'cse-3'
            },
            {
                id: 'algo',
                code: 'CS202',
                name: 'Algorithms',
                department: 'Computer Science',
                semester: '3',
                students: 35,
                schedule: 'Wed, Fri 4:00 PM',
                progress: 58,
                color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                icon: 'psychology',
                classId: 'cse-2'
            }
        ]
    });
});

// Faculty Reports Page
app.get('/faculty/reports', (req, res) => {
    res.render('faculty/reports', {
        title: 'Attendance Reports',
        summary: {
            totalClasses: 48,
            avgAttendance: 87,
            lowAttendanceStudents: 8,
            perfectAttendance: 15
        },
        courses: [
            { id: 'ds', name: 'Data Structures' },
            { id: 'prog', name: 'Programming Fundamentals' },
            { id: 'db', name: 'Database Management' },
            { id: 'algo', name: 'Algorithms' }
        ],
        dateReports: [
            { id: 'RPT001', date: '2026-02-25', course: 'Data Structures', class: 'CSE - 2nd Year', present: 32, absent: 2, late: 1, percentage: 91 },
            { id: 'RPT002', date: '2026-02-25', course: 'Programming', class: 'CSE - 1st Year', present: 38, absent: 3, late: 1, percentage: 90 },
            { id: 'RPT003', date: '2026-02-24', course: 'Database', class: 'CSE - 3rd Year', present: 25, absent: 3, late: 0, percentage: 89 },
            { id: 'RPT004', date: '2026-02-24', course: 'Algorithms', class: 'CSE - 2nd Year', present: 30, absent: 4, late: 1, percentage: 86 },
            { id: 'RPT005', date: '2026-02-23', course: 'Data Structures', class: 'CSE - 2nd Year', present: 33, absent: 1, late: 1, percentage: 94 },
            { id: 'RPT006', date: '2026-02-23', course: 'Programming', class: 'CSE - 1st Year', present: 36, absent: 5, late: 1, percentage: 86 },
            { id: 'RPT007', date: '2026-02-22', course: 'Database', class: 'CSE - 3rd Year', present: 26, absent: 2, late: 0, percentage: 93 },
            { id: 'RPT008', date: '2026-02-22', course: 'Algorithms', class: 'CSE - 2nd Year', present: 31, absent: 3, late: 1, percentage: 89 }
        ],
        studentReports: [
            { rollNo: 'CSE001', name: 'John Doe', attended: 45, missed: 3, percentage: 94 },
            { rollNo: 'CSE002', name: 'Jane Smith', attended: 44, missed: 4, percentage: 92 },
            { rollNo: 'CSE003', name: 'Mike Johnson', attended: 32, missed: 16, percentage: 67 },
            { rollNo: 'CSE004', name: 'Sarah Wilson', attended: 46, missed: 2, percentage: 96 },
            { rollNo: 'CSE005', name: 'David Brown', attended: 35, missed: 13, percentage: 73 },
            { rollNo: 'CSE006', name: 'Emily Davis', attended: 48, missed: 0, percentage: 100 },
            { rollNo: 'CSE007', name: 'Chris Lee', attended: 42, missed: 6, percentage: 88 },
            { rollNo: 'CSE008', name: 'Anna Taylor', attended: 30, missed: 18, percentage: 63 },
            { rollNo: 'CSE009', name: 'Robert Martin', attended: 47, missed: 1, percentage: 98 },
            { rollNo: 'CSE010', name: 'Lisa Anderson', attended: 43, missed: 5, percentage: 90 }
        ]
    });
});

// Faculty Profile Page
app.get('/faculty/profile', (req, res) => {
    res.render('faculty/profile', {
        title: 'My Profile',
        faculty: {
            id: 'FAC001',
            name: 'Dr. John Smith',
            email: 'john.smith@abcce.edu',
            phone: '+1 234 567 8901',
            department: 'Computer Science',
            designation: 'Associate Professor',
            qualification: 'Ph.D. in Computer Science',
            joiningDate: 'January 15, 2020',
            dob: 'March 10, 1985',
            dobRaw: '1985-03-10',
            gender: 'Male',
            address: '123 Faculty Housing, Campus Road, City 12345',
            subjects: ['Data Structures', 'Algorithms', 'Database Systems', 'Programming Fundamentals'],
            coursesCount: 4,
            studentsCount: 140,
            experience: 6,
            passwordChanged: '30 days ago'
        }
    });
});

// Faculty Notifications Page
app.get('/faculty/notifications', (req, res) => {
    res.render('faculty/notifications', {
        title: 'Notifications',
        notifications: [
            {
                id: 'N001',
                type: 'attendance',
                icon: 'fact_check',
                title: 'Low Attendance Alert',
                message: 'Student Mike Johnson (CSE003) has attendance below 70% in Data Structures.',
                time: '10 minutes ago',
                read: false,
                action: 'View Student',
                actionUrl: '/faculty/reports?student=CSE003'
            },
            {
                id: 'N002',
                type: 'system',
                icon: 'update',
                title: 'System Update',
                message: 'The attendance system will undergo maintenance tonight from 11 PM to 2 AM.',
                time: '1 hour ago',
                read: false
            },
            {
                id: 'N003',
                type: 'attendance',
                icon: 'warning',
                title: 'Pending Attendance',
                message: 'You have not marked attendance for Database class today.',
                time: '2 hours ago',
                read: false,
                action: 'Mark Now',
                actionUrl: '/faculty/attendance?class=cse-3&subject=db'
            },
            {
                id: 'N004',
                type: 'announcement',
                icon: 'campaign',
                title: 'Faculty Meeting',
                message: 'Reminder: Department faculty meeting scheduled for tomorrow at 3 PM.',
                time: '3 hours ago',
                read: true
            },
            {
                id: 'N005',
                type: 'success',
                icon: 'check_circle',
                title: 'Attendance Submitted',
                message: 'Attendance for Data Structures (CSE - 2nd Year) has been successfully submitted.',
                time: '5 hours ago',
                read: true
            },
            {
                id: 'N006',
                type: 'alert',
                icon: 'error',
                title: 'Multiple Defaulters',
                message: '3 students in Programming class have attendance below 65%.',
                time: 'Yesterday',
                read: true,
                action: 'View List',
                actionUrl: '/faculty/reports?filter=defaulters'
            }
        ],
        announcements: [
            {
                title: 'End Semester Examination Schedule',
                content: 'The end semester examinations will commence from March 15, 2026. All faculty members are requested to complete syllabus by March 10.',
                author: 'Academic Office',
                date: 'Feb 24, 2026',
                priority: 'high'
            },
            {
                title: 'Workshop on AI in Education',
                content: 'A workshop on "Artificial Intelligence in Education" will be conducted on March 5. Interested faculty may register.',
                author: 'Training Dept.',
                date: 'Feb 23, 2026',
                priority: 'medium'
            },
            {
                title: 'Library Extended Hours',
                content: 'Library will remain open until 10 PM during examination period for student convenience.',
                author: 'Library',
                date: 'Feb 22, 2026',
                priority: 'low'
            }
        ]
    });
});

// Faculty Settings Page
app.get('/faculty/settings', (req, res) => {
    res.render('faculty/settings', {
        title: 'Settings',
        settings: {
            academicYear: '2025-2026',
            minAttendance: 75,
            warningThreshold: 80,
            lateThreshold: 15
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
