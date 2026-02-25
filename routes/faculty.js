// =============================================
// FACULTY API ROUTES
// =============================================

const express = require('express');
const router = express.Router();
const { 
    users, faculty, students, departments, courses, 
    classes, attendanceRecords, notifications, settings,
    generateId 
} = require('../data/mockData');
const { authMiddleware, facultyOnly } = require('../middleware/auth');

// Apply auth middleware to all faculty routes
router.use(authMiddleware);
router.use(facultyOnly);

// =====================
// DASHBOARD
// =====================

// GET /api/faculty/dashboard - Get faculty dashboard data
router.get('/dashboard', (req, res) => {
    try {
        const facultyId = req.user.facultyId;
        const facultyMember = faculty.find(f => f.id === facultyId);

        if (!facultyMember) {
            return res.status(404).json({
                success: false,
                message: 'Faculty profile not found'
            });
        }

        // Get faculty's courses
        const facultyCourses = courses.filter(c => c.facultyId === facultyId);
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceRecords.filter(
            r => r.date === today && r.facultyId === facultyId
        );

        // Count unique students across all courses
        const studentIds = new Set();
        facultyCourses.forEach(course => {
            const cls = classes.find(c => c.departmentId === course.departmentId && c.semester === course.semester);
            if (cls) {
                students.filter(s => s.departmentId === cls.departmentId && s.semester === course.semester)
                    .forEach(s => studentIds.add(s.id));
            }
        });

        // Recent attendance records
        const recentRecords = attendanceRecords
            .filter(r => r.facultyId === facultyId)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(record => {
                const course = courses.find(c => c.id === record.courseId);
                const cls = classes.find(c => c.id === record.classId);
                const present = record.records.filter(r => r.status === 'present').length;
                const total = record.records.length;
                return {
                    date: record.date,
                    course: course ? course.name : 'Unknown',
                    class: cls ? cls.name : 'Unknown',
                    present,
                    absent: record.records.filter(r => r.status === 'absent').length,
                    percentage: total > 0 ? Math.round((present / total) * 100) : 0
                };
            });

        // Unread notifications
        const unreadNotifications = notifications.filter(
            n => n.userId === req.user.id && !n.read
        ).length;

        res.json({
            success: true,
            data: {
                faculty: {
                    id: facultyMember.id,
                    name: facultyMember.name,
                    department: facultyMember.department,
                    designation: facultyMember.designation
                },
                stats: {
                    totalCourses: facultyCourses.length,
                    totalStudents: studentIds.size,
                    classesToday: facultyCourses.length, // Simplified
                    attendanceMarkedToday: todayAttendance.length,
                    pendingAttendance: facultyCourses.length - todayAttendance.length,
                    unreadNotifications
                },
                recentRecords,
                todaySchedule: facultyCourses.map(course => ({
                    courseId: course.id,
                    courseName: course.name,
                    courseCode: course.code,
                    attendanceMarked: todayAttendance.some(a => a.courseId === course.id)
                }))
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// PROFILE
// =====================

// GET /api/faculty/profile - Get faculty profile
router.get('/profile', (req, res) => {
    try {
        const facultyMember = faculty.find(f => f.id === req.user.facultyId);

        if (!facultyMember) {
            return res.status(404).json({
                success: false,
                message: 'Faculty profile not found'
            });
        }

        const user = users.find(u => u.id === req.user.id);
        const facultyCourses = courses.filter(c => c.facultyId === facultyMember.id);

        res.json({
            success: true,
            data: {
                ...facultyMember,
                username: user ? user.username : null,
                lastLogin: user ? user.lastLogin : null,
                coursesCount: facultyCourses.length
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/faculty/profile - Update faculty profile
router.put('/profile', (req, res) => {
    try {
        const index = faculty.findIndex(f => f.id === req.user.facultyId);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Faculty profile not found'
            });
        }

        const { phone, address, dob, gender } = req.body;

        // Only allow updating certain fields
        if (phone) faculty[index].phone = phone;
        if (address) faculty[index].address = address;
        if (dob) faculty[index].dob = dob;
        if (gender) faculty[index].gender = gender;

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: faculty[index]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// COURSES
// =====================

// GET /api/faculty/courses - Get faculty's courses
router.get('/courses', (req, res) => {
    try {
        const facultyCourses = courses.filter(c => c.facultyId === req.user.facultyId);

        const coursesWithDetails = facultyCourses.map(course => {
            const dept = departments.find(d => d.id === course.departmentId);
            const cls = classes.find(c => 
                c.departmentId === course.departmentId && 
                c.semester === course.semester
            );

            // Calculate attendance stats for this course
            const courseAttendance = attendanceRecords.filter(r => r.courseId === course.id);
            const totalClasses = courseAttendance.length;
            let avgAttendance = 0;
            if (totalClasses > 0) {
                let totalPresent = 0, totalStudents = 0;
                courseAttendance.forEach(record => {
                    totalStudents += record.records.length;
                    totalPresent += record.records.filter(r => r.status === 'present' || r.status === 'late').length;
                });
                avgAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
            }

            return {
                ...course,
                departmentName: dept ? dept.name : null,
                className: cls ? cls.name : null,
                studentCount: cls ? cls.totalStudents : 0,
                classId: cls ? cls.id : null,
                stats: {
                    totalClasses,
                    avgAttendance
                }
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

// GET /api/faculty/courses/:id - Get course details
router.get('/courses/:id', (req, res) => {
    try {
        const course = courses.find(c => c.id === req.params.id && c.facultyId === req.user.facultyId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found or not assigned to you'
            });
        }

        const dept = departments.find(d => d.id === course.departmentId);
        const cls = classes.find(c => 
            c.departmentId === course.departmentId && 
            c.semester === course.semester
        );

        // Get students for this course
        const courseStudents = students.filter(s => 
            s.departmentId === course.departmentId && 
            s.semester === course.semester &&
            s.status === 'active'
        );

        // Get attendance records
        const courseAttendance = attendanceRecords.filter(r => r.courseId === course.id);

        res.json({
            success: true,
            data: {
                ...course,
                departmentName: dept ? dept.name : null,
                className: cls ? cls.name : null,
                classId: cls ? cls.id : null,
                students: courseStudents,
                attendanceRecords: courseAttendance.map(record => ({
                    id: record.id,
                    date: record.date,
                    present: record.records.filter(r => r.status === 'present').length,
                    absent: record.records.filter(r => r.status === 'absent').length,
                    late: record.records.filter(r => r.status === 'late').length,
                    total: record.records.length
                }))
            }
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// ATTENDANCE
// =====================

// GET /api/faculty/attendance - Get faculty's attendance records
router.get('/attendance', (req, res) => {
    try {
        const { courseId, date, startDate, endDate, page = 1, limit = 20 } = req.query;
        
        let filtered = attendanceRecords.filter(r => r.facultyId === req.user.facultyId);

        if (courseId) {
            filtered = filtered.filter(r => r.courseId === courseId);
        }
        if (date) {
            filtered = filtered.filter(r => r.date === date);
        }
        if (startDate) {
            filtered = filtered.filter(r => r.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(r => r.date <= endDate);
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const recordsWithDetails = filtered.map(record => {
            const course = courses.find(c => c.id === record.courseId);
            const cls = classes.find(c => c.id === record.classId);
            
            return {
                id: record.id,
                date: record.date,
                courseId: record.courseId,
                courseName: course ? course.name : 'Unknown',
                courseCode: course ? course.code : null,
                classId: record.classId,
                className: cls ? cls.name : 'Unknown',
                summary: {
                    present: record.records.filter(r => r.status === 'present').length,
                    absent: record.records.filter(r => r.status === 'absent').length,
                    late: record.records.filter(r => r.status === 'late').length,
                    total: record.records.length
                }
            };
        });

        const startIndex = (page - 1) * limit;
        const paginatedData = recordsWithDetails.slice(startIndex, startIndex + parseInt(limit));

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

// GET /api/faculty/attendance/:id - Get single attendance record
router.get('/attendance/:id', (req, res) => {
    try {
        const record = attendanceRecords.find(
            r => r.id === req.params.id && r.facultyId === req.user.facultyId
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        const course = courses.find(c => c.id === record.courseId);
        const cls = classes.find(c => c.id === record.classId);

        // Get student details for each record
        const detailedRecords = record.records.map(r => {
            const student = students.find(s => s.id === r.studentId);
            return {
                studentId: r.studentId,
                rollNo: student ? student.rollNo : 'Unknown',
                name: student ? student.name : 'Unknown',
                status: r.status,
                timeIn: r.timeIn
            };
        });

        res.json({
            success: true,
            data: {
                id: record.id,
                date: record.date,
                courseId: record.courseId,
                courseName: course ? course.name : 'Unknown',
                classId: record.classId,
                className: cls ? cls.name : 'Unknown',
                records: detailedRecords,
                summary: {
                    present: record.records.filter(r => r.status === 'present').length,
                    absent: record.records.filter(r => r.status === 'absent').length,
                    late: record.records.filter(r => r.status === 'late').length,
                    total: record.records.length
                }
            }
        });
    } catch (error) {
        console.error('Get attendance record error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// POST /api/faculty/attendance - Mark attendance
router.post('/attendance', (req, res) => {
    try {
        const { courseId, classId, date, records: attendanceData } = req.body;

        if (!courseId || !classId || !attendanceData || !Array.isArray(attendanceData)) {
            return res.status(400).json({
                success: false,
                message: 'Course ID, class ID, and attendance records are required'
            });
        }

        // Verify course belongs to faculty
        const course = courses.find(c => c.id === courseId && c.facultyId === req.user.facultyId);
        if (!course) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to mark attendance for this course'
            });
        }

        const attendanceDate = date || new Date().toISOString().split('T')[0];

        // Check if attendance already exists for this date/course
        const existingIndex = attendanceRecords.findIndex(
            r => r.date === attendanceDate && r.courseId === courseId
        );

        const newRecord = {
            id: existingIndex > -1 ? attendanceRecords[existingIndex].id : generateId('ATT'),
            date: attendanceDate,
            courseId,
            classId,
            facultyId: req.user.facultyId,
            records: attendanceData.map(record => ({
                studentId: record.studentId,
                status: record.status || 'absent',
                timeIn: record.status === 'present' || record.status === 'late' 
                    ? record.timeIn || new Date().toTimeString().slice(0, 5) 
                    : null
            }))
        };

        if (existingIndex > -1) {
            attendanceRecords[existingIndex] = newRecord;
        } else {
            attendanceRecords.push(newRecord);
        }

        res.status(201).json({
            success: true,
            message: existingIndex > -1 ? 'Attendance updated successfully' : 'Attendance marked successfully',
            data: newRecord
        });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// PUT /api/faculty/attendance/:id - Update attendance record
router.put('/attendance/:id', (req, res) => {
    try {
        const index = attendanceRecords.findIndex(
            r => r.id === req.params.id && r.facultyId === req.user.facultyId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        const { records: attendanceData } = req.body;

        if (!attendanceData || !Array.isArray(attendanceData)) {
            return res.status(400).json({
                success: false,
                message: 'Attendance records array is required'
            });
        }

        attendanceRecords[index].records = attendanceData.map(record => ({
            studentId: record.studentId,
            status: record.status || 'absent',
            timeIn: record.status === 'present' || record.status === 'late' 
                ? record.timeIn || new Date().toTimeString().slice(0, 5) 
                : null
        }));

        res.json({
            success: true,
            message: 'Attendance updated successfully',
            data: attendanceRecords[index]
        });
    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/faculty/attendance/students/:classId - Get students for attendance marking
router.get('/students/:classId', (req, res) => {
    try {
        const cls = classes.find(c => c.id === req.params.classId);

        if (!cls) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        // Get students in this class
        const classStudents = students.filter(s => 
            s.departmentId === cls.departmentId && 
            s.year === cls.year &&
            s.status === 'active'
        ).map(s => ({
            id: s.id,
            rollNo: s.rollNo,
            name: s.name,
            email: s.email
        }));

        res.json({
            success: true,
            data: {
                class: cls,
                students: classStudents
            }
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// REPORTS
// =====================

// GET /api/faculty/reports - Get attendance reports
router.get('/reports', (req, res) => {
    try {
        const { courseId, startDate, endDate, type = 'date' } = req.query;

        let filtered = attendanceRecords.filter(r => r.facultyId === req.user.facultyId);

        if (courseId) {
            filtered = filtered.filter(r => r.courseId === courseId);
        }
        if (startDate) {
            filtered = filtered.filter(r => r.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(r => r.date <= endDate);
        }

        // Sort by date
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (type === 'date') {
            // Date-wise report
            const dateReports = filtered.map(record => {
                const course = courses.find(c => c.id === record.courseId);
                const cls = classes.find(c => c.id === record.classId);
                const present = record.records.filter(r => r.status === 'present').length;
                const total = record.records.length;

                return {
                    id: record.id,
                    date: record.date,
                    course: course ? course.name : 'Unknown',
                    class: cls ? cls.name : 'Unknown',
                    present,
                    absent: record.records.filter(r => r.status === 'absent').length,
                    late: record.records.filter(r => r.status === 'late').length,
                    percentage: total > 0 ? Math.round((present / total) * 100) : 0
                };
            });

            res.json({
                success: true,
                data: { dateReports }
            });
        } else {
            // Student-wise report
            const studentAttendance = {};

            filtered.forEach(record => {
                record.records.forEach(r => {
                    if (!studentAttendance[r.studentId]) {
                        const student = students.find(s => s.id === r.studentId);
                        studentAttendance[r.studentId] = {
                            studentId: r.studentId,
                            rollNo: student ? student.rollNo : 'Unknown',
                            name: student ? student.name : 'Unknown',
                            attended: 0,
                            missed: 0,
                            late: 0
                        };
                    }

                    if (r.status === 'present') studentAttendance[r.studentId].attended++;
                    else if (r.status === 'absent') studentAttendance[r.studentId].missed++;
                    else if (r.status === 'late') {
                        studentAttendance[r.studentId].attended++;
                        studentAttendance[r.studentId].late++;
                    }
                });
            });

            const studentReports = Object.values(studentAttendance).map(s => ({
                ...s,
                total: s.attended + s.missed,
                percentage: (s.attended + s.missed) > 0 
                    ? Math.round((s.attended / (s.attended + s.missed)) * 100) 
                    : 0
            }));

            // Sort by attendance percentage
            studentReports.sort((a, b) => a.percentage - b.percentage);

            res.json({
                success: true,
                data: { studentReports }
            });
        }
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/faculty/reports/summary - Get summary report
router.get('/reports/summary', (req, res) => {
    try {
        const facultyRecords = attendanceRecords.filter(r => r.facultyId === req.user.facultyId);

        let totalClasses = facultyRecords.length;
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;

        facultyRecords.forEach(record => {
            record.records.forEach(r => {
                if (r.status === 'present') totalPresent++;
                else if (r.status === 'absent') totalAbsent++;
                else if (r.status === 'late') totalLate++;
            });
        });

        const totalRecords = totalPresent + totalAbsent + totalLate;
        const avgAttendance = totalRecords > 0 
            ? Math.round(((totalPresent + totalLate) / totalRecords) * 100) 
            : 0;

        // Find students with low attendance
        const studentAttendance = {};
        facultyRecords.forEach(record => {
            record.records.forEach(r => {
                if (!studentAttendance[r.studentId]) {
                    studentAttendance[r.studentId] = { present: 0, total: 0 };
                }
                studentAttendance[r.studentId].total++;
                if (r.status === 'present' || r.status === 'late') {
                    studentAttendance[r.studentId].present++;
                }
            });
        });

        const lowAttendanceCount = Object.values(studentAttendance).filter(
            s => s.total > 0 && (s.present / s.total) * 100 < settings.attendance.minAttendance
        ).length;

        const perfectAttendanceCount = Object.values(studentAttendance).filter(
            s => s.total > 0 && s.present === s.total
        ).length;

        res.json({
            success: true,
            data: {
                totalClasses,
                avgAttendance,
                lowAttendanceStudents: lowAttendanceCount,
                perfectAttendance: perfectAttendanceCount,
                breakdown: {
                    totalPresent,
                    totalAbsent,
                    totalLate
                }
            }
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// NOTIFICATIONS
// =====================

// GET /api/faculty/notifications - Get faculty notifications
router.get('/notifications', (req, res) => {
    try {
        const { read, type, page = 1, limit = 20 } = req.query;
        
        let filtered = notifications.filter(n => n.userId === req.user.id);

        if (read !== undefined) {
            filtered = filtered.filter(n => n.read === (read === 'true'));
        }
        if (type) {
            filtered = filtered.filter(n => n.type === type);
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const startIndex = (page - 1) * limit;
        const paginatedData = filtered.slice(startIndex, startIndex + parseInt(limit));

        res.json({
            success: true,
            data: {
                notifications: paginatedData,
                unreadCount: notifications.filter(n => n.userId === req.user.id && !n.read).length,
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

// PUT /api/faculty/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', (req, res) => {
    try {
        const notification = notifications.find(
            n => n.id === req.params.id && n.userId === req.user.id
        );
        
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

// PUT /api/faculty/notifications/read-all - Mark all as read
router.put('/notifications/read-all', (req, res) => {
    try {
        notifications
            .filter(n => n.userId === req.user.id)
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
// SETTINGS
// =====================

// GET /api/faculty/settings - Get faculty settings
router.get('/settings', (req, res) => {
    try {
        // Return only relevant settings for faculty
        res.json({
            success: true,
            data: {
                academic: settings.academic,
                attendance: {
                    minAttendance: settings.attendance.minAttendance,
                    warningThreshold: settings.attendance.warningThreshold,
                    lateThreshold: settings.attendance.lateThreshold
                },
                institution: {
                    name: settings.institution.name,
                    code: settings.institution.code
                }
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// =====================
// STUDENT LOOKUP
// =====================

// GET /api/faculty/student/:id - Get student details (for faculty's courses only)
router.get('/student/:id', (req, res) => {
    try {
        const student = students.find(s => s.id === req.params.id || s.rollNo === req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if student is in faculty's courses
        const facultyCourses = courses.filter(c => c.facultyId === req.user.facultyId);
        const isInCourse = facultyCourses.some(course => 
            course.departmentId === student.departmentId && 
            course.semester === student.semester
        );

        if (!isInCourse) {
            return res.status(403).json({
                success: false,
                message: 'Student not in your courses'
            });
        }

        // Calculate attendance for this student in faculty's courses
        let attended = 0, total = 0;
        const attendanceHistory = [];

        attendanceRecords
            .filter(r => r.facultyId === req.user.facultyId)
            .forEach(record => {
                const studentRecord = record.records.find(r => r.studentId === student.id);
                if (studentRecord) {
                    total++;
                    if (studentRecord.status === 'present' || studentRecord.status === 'late') {
                        attended++;
                    }
                    const course = courses.find(c => c.id === record.courseId);
                    attendanceHistory.push({
                        date: record.date,
                        course: course ? course.name : 'Unknown',
                        status: studentRecord.status,
                        timeIn: studentRecord.timeIn
                    });
                }
            });

        res.json({
            success: true,
            data: {
                id: student.id,
                rollNo: student.rollNo,
                name: student.name,
                email: student.email,
                department: student.department,
                year: student.year,
                semester: student.semester,
                attendance: {
                    attended,
                    total,
                    percentage: total > 0 ? Math.round((attended / total) * 100) : 0
                },
                history: attendanceHistory.slice(0, 10)
            }
        });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
