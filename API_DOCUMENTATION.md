# AMS API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /api/auth/login
Login and get access token.

**Request Body:**
```json
{
    "username": "admin",
    "password": "admin123",
    "role": "admin"  // optional: "admin" or "faculty"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "USR001",
            "username": "admin",
            "email": "admin@abcce.edu",
            "name": "System Administrator",
            "role": "admin"
        },
        "token": "abc123xyz...",
        "expiresAt": "2026-02-26T10:00:00.000Z"
    }
}
```

### POST /api/auth/logout
Logout and invalidate token.

**Headers:** `Authorization: Bearer <token>`

### GET /api/auth/verify
Verify token validity.

**Headers:** `Authorization: Bearer <token>`

### POST /api/auth/refresh
Refresh access token.

**Headers:** `Authorization: Bearer <token>`

### POST /api/auth/change-password
Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
    "currentPassword": "oldpass123",
    "newPassword": "newpass456"
}
```

---

## Admin Endpoints

All admin endpoints require admin authentication.

### Dashboard

#### GET /api/admin/dashboard
Get dashboard statistics.

**Response:**
```json
{
    "success": true,
    "data": {
        "stats": {
            "totalStudents": 10,
            "activeStudents": 9,
            "totalFaculty": 5,
            "activeFaculty": 4,
            "totalDepartments": 6,
            "totalCourses": 10,
            "todayAttendance": "85%",
            "unreadNotifications": 2
        },
        "recentActivity": [...]
    }
}
```

### Faculty Management

#### GET /api/admin/faculty
Get all faculty members.

**Query Parameters:**
- `department` - Filter by department ID or name
- `status` - Filter by status (active/inactive/on-leave)
- `search` - Search by name, email, or ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### GET /api/admin/faculty/:id
Get single faculty member.

#### POST /api/admin/faculty
Create new faculty.

**Request Body:**
```json
{
    "name": "Dr. Jane Doe",
    "email": "jane.doe@abcce.edu",
    "phone": "+1 234 567 8900",
    "department": "Computer Science",
    "designation": "Associate Professor",
    "qualification": "Ph.D. in Computer Science",
    "subjects": ["AI", "ML", "Data Science"]
}
```

#### PUT /api/admin/faculty/:id
Update faculty member.

#### DELETE /api/admin/faculty/:id
Delete faculty member.

### Student Management

#### GET /api/admin/students
Get all students.

**Query Parameters:**
- `department` - Filter by department
- `year` - Filter by year (1-4)
- `status` - Filter by status
- `search` - Search by name, email, roll number
- `page`, `limit` - Pagination

#### GET /api/admin/students/:id
Get single student with attendance history.

#### POST /api/admin/students
Create new student.

**Request Body:**
```json
{
    "rollNo": "CSE011",
    "name": "New Student",
    "email": "student@abcce.edu",
    "phone": "+1 234 567 1011",
    "department": "Computer Science",
    "year": 1,
    "semester": 1,
    "batch": "2026-2030"
}
```

#### PUT /api/admin/students/:id
Update student.

#### DELETE /api/admin/students/:id
Delete student.

### Department Management

#### GET /api/admin/departments
Get all departments with statistics.

#### GET /api/admin/departments/:id
Get department with faculty, students, and courses.

#### POST /api/admin/departments
Create new department.

**Request Body:**
```json
{
    "name": "Biotechnology",
    "code": "BT",
    "hod": "Dr. John Smith"
}
```

#### PUT /api/admin/departments/:id
Update department.

#### DELETE /api/admin/departments/:id
Delete department (only if no associated faculty/students).

### Course Management

#### GET /api/admin/courses
Get all courses.

**Query Parameters:**
- `department` - Filter by department ID
- `faculty` - Filter by faculty ID
- `semester` - Filter by semester

#### POST /api/admin/courses
Create new course.

**Request Body:**
```json
{
    "code": "CS501",
    "name": "Machine Learning",
    "departmentId": "DEP001",
    "semester": 5,
    "credits": 4,
    "facultyId": "FAC001"
}
```

#### PUT /api/admin/courses/:id
Update course.

### Attendance Management

#### GET /api/admin/attendance
Get attendance records.

**Query Parameters:**
- `date` - Specific date (YYYY-MM-DD)
- `courseId` - Filter by course
- `classId` - Filter by class
- `startDate`, `endDate` - Date range
- `page`, `limit` - Pagination

#### GET /api/admin/attendance/report
Get attendance statistics report.

**Query Parameters:**
- `departmentId` - Filter by department
- `startDate`, `endDate` - Date range

### Classes

#### GET /api/admin/classes
Get all classes.

**Query Parameters:**
- `department` - Filter by department
- `year` - Filter by year

### Settings

#### GET /api/admin/settings
Get all system settings.

#### PUT /api/admin/settings
Update settings.

**Request Body:**
```json
{
    "institution": { "name": "Updated Name" },
    "academic": { "currentYear": "2025-2026" },
    "attendance": { "minAttendance": 80 },
    "notifications": { "emailOnAbsent": true }
}
```

### Notifications

#### GET /api/admin/notifications
Get admin notifications.

**Query Parameters:**
- `read` - Filter by read status (true/false)
- `page`, `limit` - Pagination

#### PUT /api/admin/notifications/:id/read
Mark notification as read.

#### PUT /api/admin/notifications/read-all
Mark all notifications as read.

---

## Faculty Endpoints

All faculty endpoints require faculty authentication.

### Dashboard

#### GET /api/faculty/dashboard
Get faculty dashboard data.

**Response:**
```json
{
    "success": true,
    "data": {
        "faculty": {
            "id": "FAC001",
            "name": "Dr. John Smith",
            "department": "Computer Science"
        },
        "stats": {
            "totalCourses": 4,
            "totalStudents": 140,
            "attendanceMarkedToday": 2,
            "pendingAttendance": 2
        },
        "recentRecords": [...],
        "todaySchedule": [...]
    }
}
```

### Profile

#### GET /api/faculty/profile
Get faculty profile.

#### PUT /api/faculty/profile
Update profile (phone, address, dob, gender only).

**Request Body:**
```json
{
    "phone": "+1 234 567 8901",
    "address": "New Address"
}
```

### Courses

#### GET /api/faculty/courses
Get faculty's assigned courses.

#### GET /api/faculty/courses/:id
Get course details with students and attendance records.

### Attendance

#### GET /api/faculty/attendance
Get faculty's attendance records.

**Query Parameters:**
- `courseId` - Filter by course
- `date` - Specific date
- `startDate`, `endDate` - Date range
- `page`, `limit` - Pagination

#### GET /api/faculty/attendance/:id
Get single attendance record with student details.

#### POST /api/faculty/attendance
Mark attendance.

**Request Body:**
```json
{
    "courseId": "CRS001",
    "classId": "CLS002",
    "date": "2026-02-25",
    "records": [
        { "studentId": "STU001", "status": "present", "timeIn": "09:05" },
        { "studentId": "STU002", "status": "absent" },
        { "studentId": "STU003", "status": "late", "timeIn": "09:20" }
    ]
}
```

#### PUT /api/faculty/attendance/:id
Update attendance record.

#### GET /api/faculty/students/:classId
Get students for a class (for marking attendance).

### Reports

#### GET /api/faculty/reports
Get attendance reports.

**Query Parameters:**
- `courseId` - Filter by course
- `startDate`, `endDate` - Date range
- `type` - Report type: "date" or "student"

#### GET /api/faculty/reports/summary
Get summary statistics.

### Student Lookup

#### GET /api/faculty/student/:id
Get student details (only for students in faculty's courses).

### Notifications

#### GET /api/faculty/notifications
Get notifications.

**Query Parameters:**
- `read` - Filter by read status
- `type` - Filter by type (attendance/system/reminder/etc.)
- `page`, `limit` - Pagination

#### PUT /api/faculty/notifications/:id/read
Mark notification as read.

#### PUT /api/faculty/notifications/read-all
Mark all as read.

### Settings

#### GET /api/faculty/settings
Get relevant settings (academic calendar, attendance rules).

---

## Test Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Faculty
- Username: `john.smith`
- Password: `faculty123`

---

## Error Responses

All endpoints return errors in this format:
```json
{
    "success": false,
    "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Usage (JavaScript)

```javascript
// Login
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
    })
});
const { data } = await response.json();
const token = data.token;

// Get faculty list
const facultyResponse = await fetch('/api/admin/faculty', {
    headers: { 'Authorization': `Bearer ${token}` }
});
const facultyData = await facultyResponse.json();

// Mark attendance
const attendanceResponse = await fetch('/api/faculty/attendance', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${facultyToken}`
    },
    body: JSON.stringify({
        courseId: 'CRS001',
        classId: 'CLS002',
        records: [
            { studentId: 'STU001', status: 'present' },
            { studentId: 'STU002', status: 'absent' }
        ]
    })
});
```
