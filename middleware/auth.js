// =============================================
// AUTHENTICATION MIDDLEWARE
// =============================================

const { users, sessions } = require('../data/mockData');

// Verify JWT token middleware
function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Find session
        const session = sessions.find(s => s.token === token);

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Check expiry
        if (new Date(session.expiresAt) < new Date()) {
            const sessionIndex = sessions.indexOf(session);
            sessions.splice(sessionIndex, 1);

            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        // Get user
        const user = users.find(u => u.id === session.userId);

        if (!user || user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        // Attach user info to request
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            facultyId: user.facultyId || null
        };

        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Admin only middleware
function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
}

// Faculty only middleware
function facultyOnly(req, res, next) {
    if (!req.user || req.user.role !== 'faculty') {
        return res.status(403).json({
            success: false,
            message: 'Faculty access required'
        });
    }
    next();
}

// Admin or Faculty middleware
function adminOrFaculty(req, res, next) {
    if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Admin or Faculty access required'
        });
    }
    next();
}

module.exports = {
    authMiddleware,
    adminOnly,
    facultyOnly,
    adminOrFaculty
};
