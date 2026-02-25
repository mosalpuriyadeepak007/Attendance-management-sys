// =============================================
// AUTHENTICATION API ROUTES
// =============================================

const express = require('express');
const router = express.Router();
const { users, sessions, generateToken } = require('../data/mockData');

// POST /api/auth/login - User Login
router.post('/login', (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const user = users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === password
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        // Validate role if provided
        if (role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Invalid login. You are not registered as ${role}.`
            });
        }

        // Generate token
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store session
        const session = {
            token,
            userId: user.id,
            role: user.role,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString()
        };
        sessions.push(session);

        // Update last login
        user.lastLogin = new Date().toISOString();

        // Response data based on role
        const responseData = {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
        };

        if (user.role === 'faculty') {
            responseData.facultyId = user.facultyId;
        }

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: responseData,
                token,
                expiresAt: expiresAt.toISOString()
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// POST /api/auth/logout - User Logout
router.post('/logout', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        // Remove session
        const sessionIndex = sessions.findIndex(s => s.token === token);
        if (sessionIndex > -1) {
            sessions.splice(sessionIndex, 1);
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// GET /api/auth/verify - Verify Token
router.get('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required'
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
            // Remove expired session
            const sessionIndex = sessions.indexOf(session);
            sessions.splice(sessionIndex, 1);

            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        // Get user
        const user = users.find(u => u.id === session.userId);

        res.json({
            success: true,
            data: {
                userId: session.userId,
                role: session.role,
                name: user?.name,
                expiresAt: session.expiresAt
            }
        });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// POST /api/auth/refresh - Refresh Token
router.post('/refresh', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is required'
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

        // Generate new token
        const newToken = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Update session
        session.token = newToken;
        session.expiresAt = expiresAt.toISOString();

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: newToken,
                expiresAt: expiresAt.toISOString()
            }
        });

    } catch (error) {
        console.error('Refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// POST /api/auth/change-password - Change Password
router.post('/change-password', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const { currentPassword, newPassword } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Validate session
        const session = sessions.find(s => s.token === token);
        if (!session || new Date(session.expiresAt) < new Date()) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        // Find user and verify current password
        const user = users.find(u => u.id === session.userId);
        if (!user || user.password !== currentPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
