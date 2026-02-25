// =============================================
// MOCK DATABASE - Simulates database storage
// =============================================

// Users (Admin & Faculty)
const users = [
    {
        id: 'USR001',
        username: 'admin',
        password: 'admin123', // In production, use hashed passwords
        email: 'admin@abcce.edu',
        role: 'admin',
        name: 'System Administrator',
        status: 'active',
        createdAt: '2024-01-01',
        lastLogin: null
    },
    {
        id: 'USR002',
        username: 'john.smith',
        password: 'faculty123',
        email: 'john.smith@abcce.edu',
        role: 'faculty',
        facultyId: 'FAC001',
        name: 'Dr. John Smith',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: null
    },
    {
        id: 'USR003',
        username: 'sarah.j',
        password: 'faculty123',
        email: 'sarah.j@abcce.edu',
        role: 'faculty',
        facultyId: 'FAC002',
        name: 'Prof. Sarah Johnson',
        status: 'active',
        createdAt: '2024-02-10',
        lastLogin: null
    }
];

// Faculty Members
const faculty = [
    { 
        id: 'FAC001', 
        name: 'Dr. John Smith', 
        email: 'john.smith@abcce.edu', 
        phone: '+1 234 567 8901',
        department: 'Computer Science', 
        departmentId: 'DEP001',
        designation: 'Professor',
        qualification: 'Ph.D. in Computer Science',
        subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
        joiningDate: '2020-01-15',
        dob: '1985-03-10',
        gender: 'Male',
        address: '123 Faculty Housing, Campus Road, City 12345',
        status: 'active'
    },
    { 
        id: 'FAC002', 
        name: 'Prof. Sarah Johnson', 
        email: 'sarah.j@abcce.edu', 
        phone: '+1 234 567 8902',
        department: 'Electronics', 
        departmentId: 'DEP002',
        designation: 'Associate Professor',
        qualification: 'M.Tech in Electronics',
        subjects: ['Digital Electronics', 'Signal Processing'],
        joiningDate: '2019-06-20',
        dob: '1982-08-15',
        gender: 'Female',
        address: '456 Faculty Quarters, Campus Road, City 12345',
        status: 'active'
    },
    { 
        id: 'FAC003', 
        name: 'Dr. Michael Brown', 
        email: 'michael.b@abcce.edu', 
        phone: '+1 234 567 8903',
        department: 'Mechanical', 
        departmentId: 'DEP003',
        designation: 'Assistant Professor',
        qualification: 'Ph.D. in Mechanical Engineering',
        subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design'],
        joiningDate: '2021-03-10',
        dob: '1988-11-22',
        gender: 'Male',
        address: '789 Staff Colony, Campus Road, City 12345',
        status: 'on-leave'
    },
    { 
        id: 'FAC004', 
        name: 'Prof. Emily Davis', 
        email: 'emily.d@abcce.edu', 
        phone: '+1 234 567 8904',
        department: 'Civil', 
        departmentId: 'DEP004',
        designation: 'Professor',
        qualification: 'Ph.D. in Civil Engineering',
        subjects: ['Structural Analysis', 'Concrete Technology'],
        joiningDate: '2018-08-01',
        dob: '1980-05-18',
        gender: 'Female',
        address: '101 Faculty Block A, Campus Road, City 12345',
        status: 'active'
    },
    { 
        id: 'FAC005', 
        name: 'Dr. Robert Wilson', 
        email: 'robert.w@abcce.edu', 
        phone: '+1 234 567 8905',
        department: 'Computer Science', 
        departmentId: 'DEP001',
        designation: 'Associate Professor',
        qualification: 'Ph.D. in Computer Networks',
        subjects: ['Operating Systems', 'Computer Networks', 'Cloud Computing'],
        joiningDate: '2017-07-15',
        dob: '1983-09-30',
        gender: 'Male',
        address: '202 Faculty Block B, Campus Road, City 12345',
        status: 'active'
    }
];

// Departments
const departments = [
    { id: 'DEP001', name: 'Computer Science', code: 'CSE', students: 300, faculty: 15, hod: 'Dr. John Smith' },
    { id: 'DEP002', name: 'Electronics', code: 'ECE', students: 250, faculty: 12, hod: 'Prof. Sarah Johnson' },
    { id: 'DEP003', name: 'Mechanical', code: 'MECH', students: 280, faculty: 14, hod: 'Dr. Michael Brown' },
    { id: 'DEP004', name: 'Civil', code: 'CIVIL', students: 200, faculty: 10, hod: 'Prof. Emily Davis' },
    { id: 'DEP005', name: 'Mathematics', code: 'MATH', students: 0, faculty: 8, hod: 'Prof. Lisa Chen' },
    { id: 'DEP006', name: 'Physics', code: 'PHY', students: 0, faculty: 6, hod: 'Dr. James Taylor' }
];

// Students
const students = [
    { id: 'STU001', rollNo: 'CSE001', name: 'John Doe', email: 'john.doe@abcce.edu', phone: '+1 234 567 1001', departmentId: 'DEP001', department: 'Computer Science', year: 2, semester: 3, batch: '2024-2028', status: 'active' },
    { id: 'STU002', rollNo: 'CSE002', name: 'Jane Smith', email: 'jane.smith@abcce.edu', phone: '+1 234 567 1002', departmentId: 'DEP001', department: 'Computer Science', year: 2, semester: 3, batch: '2024-2028', status: 'active' },
    { id: 'STU003', rollNo: 'CSE003', name: 'Mike Johnson', email: 'mike.j@abcce.edu', phone: '+1 234 567 1003', departmentId: 'DEP001', department: 'Computer Science', year: 1, semester: 1, batch: '2025-2029', status: 'active' },
    { id: 'STU004', rollNo: 'CSE004', name: 'Sarah Wilson', email: 'sarah.w@abcce.edu', phone: '+1 234 567 1004', departmentId: 'DEP001', department: 'Computer Science', year: 3, semester: 5, batch: '2023-2027', status: 'active' },
    { id: 'STU005', rollNo: 'CSE005', name: 'David Brown', email: 'david.b@abcce.edu', phone: '+1 234 567 1005', departmentId: 'DEP001', department: 'Computer Science', year: 2, semester: 3, batch: '2024-2028', status: 'inactive' },
    { id: 'STU006', rollNo: 'ECE001', name: 'Emily Davis', email: 'emily.d@abcce.edu', phone: '+1 234 567 1006', departmentId: 'DEP002', department: 'Electronics', year: 2, semester: 3, batch: '2024-2028', status: 'active' },
    { id: 'STU007', rollNo: 'ECE002', name: 'Chris Lee', email: 'chris.l@abcce.edu', phone: '+1 234 567 1007', departmentId: 'DEP002', department: 'Electronics', year: 3, semester: 5, batch: '2023-2027', status: 'active' },
    { id: 'STU008', rollNo: 'MECH001', name: 'Anna Taylor', email: 'anna.t@abcce.edu', phone: '+1 234 567 1008', departmentId: 'DEP003', department: 'Mechanical', year: 1, semester: 1, batch: '2025-2029', status: 'active' },
    { id: 'STU009', rollNo: 'MECH002', name: 'Robert Martin', email: 'robert.m@abcce.edu', phone: '+1 234 567 1009', departmentId: 'DEP003', department: 'Mechanical', year: 4, semester: 7, batch: '2022-2026', status: 'active' },
    { id: 'STU010', rollNo: 'CIVIL001', name: 'Lisa Anderson', email: 'lisa.a@abcce.edu', phone: '+1 234 567 1010', departmentId: 'DEP004', department: 'Civil', year: 2, semester: 3, batch: '2024-2028', status: 'active' }
];

// Courses
const courses = [
    { id: 'CRS001', code: 'CS201', name: 'Data Structures', departmentId: 'DEP001', semester: 3, credits: 4, facultyId: 'FAC001' },
    { id: 'CRS002', code: 'CS101', name: 'Programming Fundamentals', departmentId: 'DEP001', semester: 1, credits: 4, facultyId: 'FAC001' },
    { id: 'CRS003', code: 'CS301', name: 'Database Management', departmentId: 'DEP001', semester: 5, credits: 4, facultyId: 'FAC001' },
    { id: 'CRS004', code: 'CS202', name: 'Algorithms', departmentId: 'DEP001', semester: 3, credits: 3, facultyId: 'FAC001' },
    { id: 'CRS005', code: 'EC201', name: 'Digital Electronics', departmentId: 'DEP002', semester: 3, credits: 4, facultyId: 'FAC002' },
    { id: 'CRS006', code: 'EC301', name: 'Signal Processing', departmentId: 'DEP002', semester: 5, credits: 3, facultyId: 'FAC002' },
    { id: 'CRS007', code: 'ME201', name: 'Thermodynamics', departmentId: 'DEP003', semester: 3, credits: 4, facultyId: 'FAC003' },
    { id: 'CRS008', code: 'ME301', name: 'Fluid Mechanics', departmentId: 'DEP003', semester: 5, credits: 4, facultyId: 'FAC003' },
    { id: 'CRS009', code: 'CE201', name: 'Structural Analysis', departmentId: 'DEP004', semester: 3, credits: 4, facultyId: 'FAC004' },
    { id: 'CRS010', code: 'CS401', name: 'Cloud Computing', departmentId: 'DEP001', semester: 7, credits: 3, facultyId: 'FAC005' }
];

// Classes (Batches)
const classes = [
    { id: 'CLS001', name: 'CSE - 1st Year', departmentId: 'DEP001', year: 1, semester: 1, totalStudents: 42 },
    { id: 'CLS002', name: 'CSE - 2nd Year', departmentId: 'DEP001', year: 2, semester: 3, totalStudents: 35 },
    { id: 'CLS003', name: 'CSE - 3rd Year', departmentId: 'DEP001', year: 3, semester: 5, totalStudents: 28 },
    { id: 'CLS004', name: 'CSE - 4th Year', departmentId: 'DEP001', year: 4, semester: 7, totalStudents: 30 },
    { id: 'CLS005', name: 'ECE - 2nd Year', departmentId: 'DEP002', year: 2, semester: 3, totalStudents: 38 },
    { id: 'CLS006', name: 'ECE - 3rd Year', departmentId: 'DEP002', year: 3, semester: 5, totalStudents: 32 },
    { id: 'CLS007', name: 'MECH - 1st Year', departmentId: 'DEP003', year: 1, semester: 1, totalStudents: 45 },
    { id: 'CLS008', name: 'CIVIL - 2nd Year', departmentId: 'DEP004', year: 2, semester: 3, totalStudents: 36 }
];

// Attendance Records
const attendanceRecords = [
    { id: 'ATT001', date: '2026-02-25', courseId: 'CRS001', classId: 'CLS002', facultyId: 'FAC001', records: [
        { studentId: 'STU001', status: 'present', timeIn: '09:02' },
        { studentId: 'STU002', status: 'present', timeIn: '09:05' },
        { studentId: 'STU005', status: 'absent', timeIn: null }
    ]},
    { id: 'ATT002', date: '2026-02-25', courseId: 'CRS002', classId: 'CLS001', facultyId: 'FAC001', records: [
        { studentId: 'STU003', status: 'present', timeIn: '11:00' }
    ]},
    { id: 'ATT003', date: '2026-02-24', courseId: 'CRS003', classId: 'CLS003', facultyId: 'FAC001', records: [
        { studentId: 'STU004', status: 'present', timeIn: '14:03' }
    ]},
    { id: 'ATT004', date: '2026-02-24', courseId: 'CRS004', classId: 'CLS002', facultyId: 'FAC001', records: [
        { studentId: 'STU001', status: 'late', timeIn: '16:15' },
        { studentId: 'STU002', status: 'present', timeIn: '16:00' }
    ]},
    { id: 'ATT005', date: '2026-02-23', courseId: 'CRS005', classId: 'CLS005', facultyId: 'FAC002', records: [
        { studentId: 'STU006', status: 'present', timeIn: '10:00' }
    ]}
];

// Notifications
const notifications = [
    {
        id: 'NOT001',
        userId: 'USR002',
        type: 'attendance',
        title: 'Low Attendance Alert',
        message: 'Student Mike Johnson (CSE003) has attendance below 70% in Data Structures.',
        read: false,
        createdAt: '2026-02-25T09:30:00Z'
    },
    {
        id: 'NOT002',
        userId: 'USR002',
        type: 'system',
        title: 'System Update',
        message: 'The attendance system will undergo maintenance tonight from 11 PM to 2 AM.',
        read: false,
        createdAt: '2026-02-25T08:00:00Z'
    },
    {
        id: 'NOT003',
        userId: 'USR002',
        type: 'reminder',
        title: 'Pending Attendance',
        message: 'You have not marked attendance for Database class today.',
        read: false,
        createdAt: '2026-02-25T14:00:00Z'
    },
    {
        id: 'NOT004',
        userId: 'USR001',
        type: 'alert',
        title: 'New Faculty Registration',
        message: 'A new faculty member registration request is pending approval.',
        read: false,
        createdAt: '2026-02-25T07:00:00Z'
    }
];

// Settings
const settings = {
    institution: {
        name: 'ABC College of Engineering',
        code: 'ABCCE',
        address: '123 Education Street, City, State 12345',
        phone: '+1 234 567 8900',
        email: 'admin@abcce.edu',
        website: 'www.abcce.edu'
    },
    academic: {
        currentYear: '2025-2026',
        semesters: ['Odd', 'Even'],
        startDate: '2025-07-01',
        endDate: '2026-06-30'
    },
    attendance: {
        minAttendance: 75,
        warningThreshold: 80,
        lateThreshold: 15, // minutes
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: '09:00',
        endTime: '17:00'
    },
    notifications: {
        emailOnAbsent: true,
        emailOnLowAttendance: true,
        emailWeeklyReport: false,
        smsOnAbsent: false,
        parentNotification: true
    }
};

// Sessions (for auth tokens)
const sessions = [];

// Helper functions
function generateId(prefix) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`.toUpperCase();
}

function generateToken() {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

module.exports = {
    users,
    faculty,
    departments,
    students,
    courses,
    classes,
    attendanceRecords,
    notifications,
    settings,
    sessions,
    generateId,
    generateToken
};
