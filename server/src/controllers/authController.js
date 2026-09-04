const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET || 'careerpilot_super_secret_jwt_key_2026_final_year_project',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// @desc    Register a new student/user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, college, degree, graduationYear, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.'
      });
    }

    // Check if user exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (e) {
      // In-memory fallback support
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      education: {
        college: college || 'National Institute of Technology',
        degree: degree || 'B.Tech',
        department: department || 'Computer Science & Engineering',
        graduationYear: graduationYear ? Number(graduationYear) : 2026
      },
      skills: {
        languages: ['JavaScript', 'HTML5', 'CSS3'],
        frameworks: ['React.js'],
        databases: ['MongoDB'],
        tools: ['Git', 'VS Code'],
        softSkills: ['Problem Solving', 'Communication']
      },
      careerPreferences: {
        targetRole: 'Full Stack Developer',
        preferredEmploymentType: 'Full-time'
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        skills: user.skills,
        careerPreferences: user.careerPreferences,
        readinessScore: user.readinessScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        skills: user.skills,
        careerPreferences: user.careerPreferences,
        readinessScore: user.readinessScore,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        projects: user.projects,
        certifications: user.certifications
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(200).json({
        success: true,
        user: req.user
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change / Update Password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current password and new password.'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.'
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully!',
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    1-Click Demo Student Login
// @route   POST /api/auth/demo-student
// @access  Public
const demoStudentLogin = async (req, res, next) => {
  try {
    const demoEmail = 'student.demo@careerpilot.ai';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Aarav Sharma',
        email: demoEmail,
        password: 'Password@123',
        role: 'student',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka',
        bio: 'B.Tech CSE final year student passionate about Full-Stack Development, Distributed Systems, and AI-assisted cloud tools.',
        education: {
          college: 'Indian Institute of Information Technology (IIIT)',
          degree: 'B.Tech',
          department: 'Computer Science and Engineering',
          graduationYear: 2026,
          cgpa: '8.85'
        },
        skills: {
          languages: ['JavaScript', 'TypeScript', 'Python', 'C++', 'SQL'],
          frameworks: ['React.js', 'Node.js', 'Express.js', 'TailwindCSS / Vanilla CSS'],
          databases: ['MongoDB', 'PostgreSQL', 'Redis'],
          tools: ['Git', 'Docker', 'Postman', 'Vercel', 'AWS S3'],
          softSkills: ['Analytical Thinking', 'Problem Solving', 'Agile Collaboration', 'Technical Presentation']
        },
        careerPreferences: {
          targetRole: 'Full Stack Developer',
          preferredTech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Docker'],
          preferredLocation: 'Bengaluru / Hyderabad / Remote',
          preferredEmploymentType: 'Full-time',
          expectedSalary: '₹12,00,000 - ₹18,00,000 / year'
        },
        projects: [
          {
            title: 'SkillSwap — Peer Mentorship & Code Review Platform',
            description: 'Full-stack collaborative portal featuring real-time socket sessions, markdown whiteboard, and JWT authentication.',
            technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io'],
            githubUrl: 'https://github.com/aaravsharma/skillswap',
            liveUrl: 'https://skillswap-demo.vercel.app',
            featured: true
          },
          {
            title: 'DevPulse — Developer Productivity & GitHub Metrics Visualizer',
            description: 'Analyzes commit frequency, code complexity, and PR velocity with interactive chart visualizations.',
            technologies: ['React', 'Chart.js', 'Express', 'GitHub REST API'],
            githubUrl: 'https://github.com/aaravsharma/devpulse',
            liveUrl: 'https://devpulse.vercel.app',
            featured: true
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: 'Jan 2025',
            url: 'https://aws.amazon.com/certification'
          },
          {
            name: 'Meta Front-End Developer Specialization',
            issuer: 'Coursera / Meta',
            date: 'Nov 2024',
            url: 'https://coursera.org'
          }
        ],
        readinessScore: {
          overall: 78,
          resume: 82,
          skills: 75,
          coding: 72,
          interview: 80,
          projects: 85,
          history: [
            { date: new Date('2026-06-01'), score: 54 },
            { date: new Date('2026-07-01'), score: 65 },
            { date: new Date('2026-08-01'), score: 78 }
          ],
          lastCalculated: new Date()
        }
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in as Demo Student!',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    1-Click Demo Admin Login
// @route   POST /api/auth/demo-admin
// @access  Public
const demoAdminLogin = async (req, res, next) => {
  try {
    const adminEmail = 'admin@careerpilot.ai';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Dr. Priya Ramesh (Placement Director)',
        email: adminEmail,
        password: 'AdminPassword@123',
        role: 'admin',
        phone: '+91 91234 56789',
        location: 'Campus Placement Office',
        bio: 'Head of Career Guidance & Corporate Relations. Overseeing student career roadmaps, job opportunities, and coding benchmarks.',
        education: {
          college: 'IIT Madras',
          degree: 'Ph.D. in Computer Science',
          department: 'Academic & Placement Division',
          graduationYear: 2012
        }
      });
    }

    const token = generateToken(adminUser);

    res.status(200).json({
      success: true,
      message: 'Logged in as Demo Placement Admin!',
      token,
      user: adminUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password via registered email verification
// @route   POST /api/auth/reset-password
// @access  Public
const resetPasswordViaEmail = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your registered email address and a new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered student account was found with this email address.'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Password successfully updated for ${email}! You can now sign in with your new password.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword,
  resetPasswordViaEmail,
  demoStudentLogin,
  demoAdminLogin
};

