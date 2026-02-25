// =============================================
// ADMIN API ROUTES
// =============================================

const express = require('express');
const router = express.Router();
const { 
    users, faculty, students, departments, courses, 
    classes, attendanceRecords, notifications, settings, 
    generateId 
} = require('../data/mockData');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(authMiddleware);
router.use(adminOnly);

// =====================
// DASHBOARD STATISTICS
// =====================

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', (req, res) => {
    try {
        const totalStudents = students.length;
        const activeStudents = students.filter(s => s.status === 'active').length;
        const totalFaculty = faculty.length;
        const activeFaculty = faculty.filter(f => f.status === 'active').length;
        const totalDepartments = departments.length;
        
        // Calculate today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = attendanceRecords.filter(r => r.date === today);
        let presentCount = 0, totalCount = 0;
        todayRecords.forEach(r => {
            totalCount += r.records.length;
            presentCount += r.records.filter(s => s.status === 'present').length;
        });
        const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

        const unreadNotifications = notifications.filter(n => n.userId === 'USR001' && !n.read).length;

        res.json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    activeStudents,
                    totalFaculty,
                    activeFaculty,
                    totalDepartments,
                    totalCourses: courses.length,
                    todayAttendance: attendancePercentage + '%',
                    unreadNotifications
                },
                recentActivity: [
                    { type: 'attendance', message: 'Attendance marked for CSE - 2nd Year', time: '2 hours ago' },
                    { type: 'student', message: 'New student registered: John Doe', time: '3 hours ago' },
                    { type: 'faculty', message: 'Faculty Dr. Smith updated profile', time: '5 hours ago' }
                ]
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// FACULTY MANAGEMENT
// =====================

// GET /api/admin/faculty - Get all faculty
router.get('/faculty', (req, res) => {
    try {
        const { department, status, search, page = 1, limit = 10 } = req.query;
        
        let filtered = [...faculty];

        // Apply filters
        if (department) {
            filtered = filtered.filter(f => f.departmentId === department || f.department === department);
        }
        if (status) {
            filtered = filtered.filter(f => f.status === status);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(f => 
                f.name.toLowerCase().includes(searchLower) ||
                f.email.toLowerCase().includes(searchLower) ||
                f.id.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = filtered.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: {
                faculty: paginatedData,
                pagination: {
                    total: filtered.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(filtered.length / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/admin/faculty/:id - Get single faculty
router.get('/faculty/:id', (req, res) => {
    try {
        const facultyMember = faculty.find(f => f.id === req.params.id);
        
        if (!facultyMember) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found'
            });
        }

        // Get related courses
        const facultyCourses = courses.filter(c => c.facultyId === req.params.id);

        res.json({
            success: true,
            data: {
                ...facultyMember,
                courses: facultyCourses
            }
        });
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/admin/faculty - Create new faculty
router.post('/faculty', (req, res) => {
    try {
        const { name, email, phone, department, designation, subjects, qualification } = req.body;

        // Validation
        if (!name || !email || !department) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and department are required'
            });
        }

        // Check duplicate email
        if (faculty.find(f => f.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Find department
        const dept = departments.find(d => d.id === department || d.name === department);

        const newFaculty = {
            id: generateId('FAC'),
            name,
            email,
            phone: phone || '',
            department: dept ? dept.name : department,
            departmentId: dept ? dept.id : null,
            designation: designation || 'Lecturer',
            qualification: qualification || '',
            subjects: subjects || [],
            joiningDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };

        faculty.push(newFaculty);

        // Create user account
        const newUser = {
            id: generateId('USR'),
            username: email.split('@')[0],
            password: 'faculty123', // Default password
            email,
            role: 'faculty',
            facultyId: newFaculty.id,
            name,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        users.push(newUser);

        res.status(201).json({
            success: true,
            message: 'Faculty member created successfully',
            data: newFaculty
        });
    } catch (error) {
        console.error('Create faculty error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/faculty/:id - Update faculty
router.put('/faculty/:id', (req, res) => {
    try {
        const index = faculty.findIndex(f => f.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found'
            });
        }

        const { name, email, phone, department, designation, subjects, qualification, status } = req.body;

        // Check duplicate email (exclude current)
        if (email && email !== faculty[index].email && faculty.find(f => f.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Update fields
        if (name) faculty[index].name = name;
        if (email) faculty[index].email = email;
        if (phone) faculty[index].phone = phone;
        if (department) {
            const dept = departments.find(d => d.id === department || d.name === department);
            faculty[index].department = dept ? dept.name : department;
            faculty[index].departmentId = dept ? dept.id : null;
        }
        if (designation) faculty[index].designation = designation;
        if (subjects) faculty[index].subjects = subjects;
        if (qualification) faculty[index].qualification = qualification;
        if (status) faculty[index].status = status;

        res.json({
            success: true,
            message: 'Faculty member updated successfully',
            data: faculty[index]
        });
    } catch (error) {
        console.error('Update faculty error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// DELETE /api/admin/faculty/:id - Delete faculty
router.delete('/faculty/:id', (req, res) => {
    try {
        const index = faculty.findIndex(f => f.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found'
            });
        }

        const deleted = faculty.splice(index, 1)[0];

        // Also remove user account
        const userIndex = users.findIndex(u => u.facultyId === req.params.id);
        if (userIndex > -1) {
            users.splice(userIndex, 1);
        }

        res.json({
            success: true,
            message: 'Faculty member deleted successfully',
            data: deleted
        });
    } catch (error) {
        console.error('Delete faculty error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// STUDENT MANAGEMENT
// =====================

// GET /api/admin/students - Get all students
router.get('/students', (req, res) => {
    try {
        const { department, year, status, search, page = 1, limit = 10 } = req.query;
        
        let filtered = [...students];

        if (department) {
            filtered = filtered.filter(s => s.departmentId === department || s.department === department);
        }
        if (year) {
            filtered = filtered.filter(s => s.year === parseInt(year));
        }
        if (status) {
            filtered = filtered.filter(s => s.status === status);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(s => 
                s.name.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower) ||
                s.rollNo.toLowerCase().includes(searchLower)
            );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = filtered.slice(startIndex, endIndex);

        // Calculate attendance for each student
        const studentsWithAttendance = paginatedData.map(student => {
            let attended = 0, total = 0;
            attendanceRecords.forEach(record => {
                const studentRecord = record.records.find(r => r.studentId === student.id);
                if (studentRecord) {
                    total++;
                    if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                        attended++;
                    }
                }
            });
            return {
                ...student,
                attendance: total > 0 ? Math.round((attended / total) * 100) : 0
            };
        });

        res.json({
            success: true,
            data: {
                students: studentsWithAttendance,
                pagination: {
                    total: filtered.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(filtered.length / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/admin/students/:id - Get single student
router.get('/students/:id', (req, res) => {
    try {
        const student = students.find(s => s.id === req.params.id || s.rollNo === req.params.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Calculate attendance
        let attended = 0, total = 0, attendanceHistory = [];
        attendanceRecords.forEach(record => {
            const studentRecord = record.records.find(r => r.studentId === student.id);
            if (studentRecord) {
                total++;
                if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                    attended++;
                }
                attendanceHistory.push({
                    date: record.date,
                    courseId: record.courseId,
                    status: studentRecord.status,
                    timeIn: studentRecord.timeIn
                });
            }
        });

        res.json({
            success: true,
            data: {
                ...student,
                attendance: total > 0 ? Math.round((attended / total) * 100) : 0,
                attendedClasses: attended,
                totalClasses: total,
                attendanceHistory
            }
        });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/admin/students - Create new student
router.post('/students', (req, res) => {
    try {
        const { rollNo, name, email, phone, department, year, semester, batch } = req.body;

        if (!rollNo || !name || !email || !department) {
            return res.status(400).json({
                success: false,
                message: 'Roll number, name, email, and department are required'
            });
        }

        if (students.find(s => s.rollNo === rollNo)) {
            return res.status(400).json({
                success: false,
                message: 'Roll number already exists'
            });
        }

        if (students.find(s => s.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const dept = departments.find(d => d.id === department || d.name === department);

        const newStudent = {
            id: generateId('STU'),
            rollNo,
            name,
            email,
            phone: phone || '',
            departmentId: dept ? dept.id : null,
            department: dept ? dept.name : department,
            year: year || 1,
            semester: semester || 1,
            batch: batch || `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
            status: 'active'
        };

        students.push(newStudent);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: newStudent
        });
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/students/:id - Update student
router.put('/students/:id', (req, res) => {
    try {
        const index = students.findIndex(s => s.id === req.params.id || s.rollNo === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const { name, email, phone, department, year, semester, status } = req.body;

        if (name) students[index].name = name;
        if (email) students[index].email = email;
        if (phone) students[index].phone = phone;
        if (department) {
            const dept = departments.find(d => d.id === department || d.name === department);
            students[index].department = dept ? dept.name : department;
            students[index].departmentId = dept ? dept.id : null;
        }
        if (year) students[index].year = year;
        if (semester) students[index].semester = semester;
        if (status) students[index].status = status;

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: students[index]
        });
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// DELETE /api/admin/students/:id - Delete student
router.delete('/students/:id', (req, res) => {
    try {
        const index = students.findIndex(s => s.id === req.params.id || s.rollNo === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const deleted = students.splice(index, 1)[0];

        res.json({
            success: true,
            message: 'Student deleted successfully',
            data: deleted
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// DEPARTMENT MANAGEMENT
// =====================

// GET /api/admin/departments - Get all departments
router.get('/departments', (req, res) => {
    try {
        const departmentsWithStats = departments.map(dept => ({
            ...dept,
            facultyCount: faculty.filter(f => f.departmentId === dept.id).length,
            studentCount: students.filter(s => s.departmentId === dept.id).length
        }));

        res.json({
            success: true,
            data: departmentsWithStats
        });
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/admin/departments/:id - Get single department
router.get('/departments/:id', (req, res) => {
    try {
        const dept = departments.find(d => d.id === req.params.id);
        
        if (!dept) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const deptFaculty = faculty.filter(f => f.departmentId === dept.id);
        const deptStudents = students.filter(s => s.departmentId === dept.id);
        const deptCourses = courses.filter(c => c.departmentId === dept.id);

        res.json({
            success: true,
            data: {
                ...dept,
                faculty: deptFaculty,
                students: deptStudents,
                courses: deptCourses
            }
        });
    } catch (error) {
        console.error('Get department error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/admin/departments - Create department
router.post('/departments', (req, res) => {
    try {
        const { name, code, hod } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: 'Name and code are required'
            });
        }

        if (departments.find(d => d.code === code)) {
            return res.status(400).json({
                success: false,
                message: 'Department code already exists'
            });
        }

        const newDept = {
            id: generateId('DEP'),
            name,
            code,
            students: 0,
            faculty: 0,
            hod: hod || null
        };

        departments.push(newDept);

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: newDept
        });
    } catch (error) {
        console.error('Create department error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/departments/:id - Update department
router.put('/departments/:id', (req, res) => {
    try {
        const index = departments.findIndex(d => d.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        const { name, code, hod } = req.body;

        if (name) departments[index].name = name;
        if (code) departments[index].code = code;
        if (hod !== undefined) departments[index].hod = hod;

        res.json({
            success: true,
            message: 'Department updated successfully',
            data: departments[index]
        });
    } catch (error) {
        console.error('Update department error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// DELETE /api/admin/departments/:id - Delete department
router.delete('/departments/:id', (req, res) => {
    try {
        const index = departments.findIndex(d => d.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Check for associated faculty/students
        const deptFaculty = faculty.filter(f => f.departmentId === req.params.id);
        const deptStudents = students.filter(s => s.departmentId === req.params.id);

        if (deptFaculty.length > 0 || deptStudents.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete department with associated faculty or students'
            });
        }

        const deleted = departments.splice(index, 1)[0];

        res.json({
            success: true,
            message: 'Department deleted successfully',
            data: deleted
        });
    } catch (error) {
        console.error('Delete department error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// COURSE MANAGEMENT
// =====================

// GET /api/admin/courses - Get all courses
router.get('/courses', (req, res) => {
    try {
        const { department, faculty: facultyId, semester } = req.query;
        
        let filtered = [...courses];

        if (department) {
            filtered = filtered.filter(c => c.departmentId === department);
        }
        if (facultyId) {
            filtered = filtered.filter(c => c.facultyId === facultyId);
        }
        if (semester) {
            filtered = filtered.filter(c => c.semester === parseInt(semester));
        }

        // Add faculty and department names
        const coursesWithDetails = filtered.map(course => {
            const facultyMember = faculty.find(f => f.id === course.facultyId);
            const dept = departments.find(d => d.id === course.departmentId);
            return {
                ...course,
                facultyName: facultyMember ? facultyMember.name : null,
                departmentName: dept ? dept.name : null
            };
        });

        res.json({
            success: true,
            data: coursesWithDetails
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/admin/courses - Create course
router.post('/courses', (req, res) => {
    try {
        const { code, name, departmentId, semester, credits, facultyId } = req.body;

        if (!code || !name || !departmentId) {
            return res.status(400).json({
                success: false,
                message: 'Code, name, and department are required'
            });
        }

        if (courses.find(c => c.code === code)) {
            return res.status(400).json({
                success: false,
                message: 'Course code already exists'
            });
        }

        const newCourse = {
            id: generateId('CRS'),
            code,
            name,
            departmentId,
            semester: semester || 1,
            credits: credits || 3,
            facultyId: facultyId || null
        };

        courses.push(newCourse);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: newCourse
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/courses/:id - Update course
router.put('/courses/:id', (req, res) => {
    try {
        const index = courses.findIndex(c => c.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const { code, name, departmentId, semester, credits, facultyId } = req.body;

        if (code) courses[index].code = code;
        if (name) courses[index].name = name;
        if (departmentId) courses[index].departmentId = departmentId;
        if (semester) courses[index].semester = semester;
        if (credits) courses[index].credits = credits;
        if (facultyId !== undefined) courses[index].facultyId = facultyId;

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: courses[index]
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// ATTENDANCE MANAGEMENT
// =====================

// GET /api/admin/attendance - Get attendance records
router.get('/attendance', (req, res) => {
    try {
        const { date, courseId, classId, startDate, endDate, page = 1, limit = 20 } = req.query;
        
        let filtered = [...attendanceRecords];

        if (date) {
            filtered = filtered.filter(r => r.date === date);
        }
        if (courseId) {
            filtered = filtered.filter(r => r.courseId === courseId);
        }
        if (classId) {
            filtered = filtered.filter(r => r.classId === classId);
        }
        if (startDate) {
            filtered = filtered.filter(r => r.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(r => r.date <= endDate);
        }

        // Add details
        const recordsWithDetails = filtered.map(record => {
            const course = courses.find(c => c.id === record.courseId);
            const cls = classes.find(c => c.id === record.classId);
            const fac = faculty.find(f => f.id === record.facultyId);
            
            const present = record.records.filter(r => r.status === 'present').length;
            const absent = record.records.filter(r => r.status === 'absent').length;
            const late = record.records.filter(r => r.status === 'late').length;

            return {
                ...record,
                courseName: course ? course.name : null,
                className: cls ? cls.name : null,
                facultyName: fac ? fac.name : null,
                summary: { present, absent, late, total: record.records.length }
            };
        });

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = recordsWithDetails.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: {
                records: paginatedData,
                pagination: {
                    total: filtered.length,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(filtered.length / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/admin/attendance/report - Get attendance report
router.get('/attendance/report', (req, res) => {
    try {
        const { departmentId, startDate, endDate } = req.query;

        let departmentFilter = null;
        if (departmentId) {
            departmentFilter = departmentId;
        }

        // Calculate overall statistics
        let totalClasses = 0;
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;

        attendanceRecords.forEach(record => {
            if (startDate && record.date < startDate) return;
            if (endDate && record.date > endDate) return;

            totalClasses++;
            record.records.forEach(r => {
                if (r.status === 'present') totalPresent++;
                else if (r.status === 'absent') totalAbsent++;
                else if (r.status === 'late') totalLate++;
            });
        });

        const totalRecords = totalPresent + totalAbsent + totalLate;
        const avgAttendance = totalRecords > 0 ? Math.round(((totalPresent + totalLate) / totalRecords) * 100) : 0;

        // Department-wise breakdown
        const departmentStats = departments.map(dept => {
            const deptStudents = students.filter(s => s.departmentId === dept.id);
            let attended = 0, total = 0;
            
            deptStudents.forEach(student => {
                attendanceRecords.forEach(record => {
                    const studentRecord = record.records.find(r => r.studentId === student.id);
                    if (studentRecord) {
                        total++;
                        if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                            attended++;
                        }
                    }
                });
            });

            return {
                departmentId: dept.id,
                departmentName: dept.name,
                studentCount: deptStudents.length,
                attendance: total > 0 ? Math.round((attended / total) * 100) : 0
            };
        });

        res.json({
            success: true,
            data: {
                summary: {
                    totalClasses,
                    totalPresent,
                    totalAbsent,
                    totalLate,
                    avgAttendance
                },
                departmentStats
            }
        });
    } catch (error) {
        console.error('Get attendance report error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// SETTINGS MANAGEMENT
// =====================

// GET /api/admin/settings - Get all settings
router.get('/settings', (req, res) => {
    try {
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/settings - Update settings
router.put('/settings', (req, res) => {
    try {
        const { institution, academic, attendance, notifications: notifSettings } = req.body;

        if (institution) {
            Object.assign(settings.institution, institution);
        }
        if (academic) {
            Object.assign(settings.academic, academic);
        }
        if (attendance) {
            Object.assign(settings.attendance, attendance);
        }
        if (notifSettings) {
            Object.assign(settings.notifications, notifSettings);
        }

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// NOTIFICATIONS
// =====================

// GET /api/admin/notifications - Get admin notifications
router.get('/notifications', (req, res) => {
    try {
        const { read, page = 1, limit = 20 } = req.query;
        
        let filtered = notifications.filter(n => n.userId === 'USR001');

        if (read !== undefined) {
            filtered = filtered.filter(n => n.read === (read === 'true'));
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const startIndex = (page - 1) * limit;
        const paginatedData = filtered.slice(startIndex, startIndex + parseInt(limit));

        res.json({
            success: true,
            data: {
                notifications: paginatedData,
                unreadCount: notifications.filter(n => n.userId === 'USR001' && !n.read).length,
                pagination: {
                    total: filtered.length,
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', (req, res) => {
    try {
        const notification = notifications.find(n => n.id === req.params.id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        notification.read = true;

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Mark notification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/admin/notifications/read-all - Mark all as read
router.put('/notifications/read-all', (req, res) => {
    try {
        notifications
            .filter(n => n.userId === 'USR001')
            .forEach(n => n.read = true);

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all notifications error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// CLASSES MANAGEMENT
// =====================

// GET /api/admin/classes - Get all classes
router.get('/classes', (req, res) => {
    try {
        const { department, year } = req.query;
        
        let filtered = [...classes];

        if (department) {
            filtered = filtered.filter(c => c.departmentId === department);
        }
        if (year) {
            filtered = filtered.filter(c => c.year === parseInt(year));
        }

        const classesWithDetails = filtered.map(cls => {
            const dept = departments.find(d => d.id === cls.departmentId);
            return {
                ...cls,
                departmentName: dept ? dept.name : null
            };
        });

        res.json({
            success: true,
            data: classesWithDetails
        });
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
