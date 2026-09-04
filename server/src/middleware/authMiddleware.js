const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'careerpilot_super_secret_jwt_key_2026_final_year_project'
    );

    let user;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch (dbErr) {
      // In fallback / memory mock mode
    }

    if (!user) {
      // Construct fallback user object if token is valid (e.g. demo tokens)
      user = {
        _id: decoded.id,
        name: decoded.name || 'Student User',
        email: decoded.email || 'student@careerpilot.ai',
        role: decoded.role || 'student',
        education: decoded.education || { college: 'IIT Delhi', degree: 'B.Tech', department: 'Computer Science', graduationYear: 2026, cgpa: '8.9' },
        skills: decoded.skills || {
          languages: ['JavaScript', 'Python', 'C++'],
          frameworks: ['React', 'Node.js', 'Express.js'],
          databases: ['MongoDB', 'PostgreSQL'],
          tools: ['Git', 'Docker', 'Postman'],
          softSkills: ['Problem Solving', 'Team Leadership', 'Agile Communication']
        },
        careerPreferences: { targetRole: 'Full Stack Developer', preferredEmploymentType: 'Full-time' },
        readinessScore: { overall: 76, resume: 82, skills: 75, coding: 68, interview: 79, projects: 80 }
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is invalid or has expired.'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this route.`
      });
    }
    next();
  };
};

const adminOnly = authorizeRoles('admin');

module.exports = { protect, authorizeRoles, adminOnly };
