const User = require('../models/User');

// @desc    Get complete student profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(200).json({ success: true, user: req.user });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update personal & education profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      location,
      bio,
      avatar,
      education,
      careerPreferences
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (education) user.education = { ...user.education, ...education };
    if (careerPreferences) user.careerPreferences = { ...user.careerPreferences, ...careerPreferences };

    user.calculateReadinessScore();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skills
// @route   PUT /api/profile/skills
// @access  Private
const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.skills = skills;
    user.calculateReadinessScore();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skills updated successfully!',
      skills: user.skills,
      readinessScore: user.readinessScore
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add project
// @route   POST /api/profile/projects
// @access  Private
const addProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, featured } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.projects.push({
      title,
      description: description || '',
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      featured: !!featured
    });

    user.calculateReadinessScore();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Project added successfully!',
      projects: user.projects,
      readinessScore: user.readinessScore
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/profile/projects/:projectId
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.projects = user.projects.filter(p => p._id.toString() !== req.params.projectId);
    user.calculateReadinessScore();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Project removed successfully!',
      projects: user.projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add certification
// @route   POST /api/profile/certifications
// @access  Private
const addCertification = async (req, res, next) => {
  try {
    const { name, issuer, date, url } = req.body;
    if (!name || !issuer) {
      return res.status(400).json({ success: false, message: 'Certification name and issuer are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.certifications.push({ name, issuer, date: date || '', url: url || '' });
    user.calculateReadinessScore();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Certification added successfully!',
      certifications: user.certifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certification
// @route   DELETE /api/profile/certifications/:certId
// @access  Private
const deleteCertification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.certifications = user.certifications.filter(c => c._id.toString() !== req.params.certId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Certification removed successfully!',
      certifications: user.certifications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSkills,
  addProject,
  deleteProject,
  addCertification,
  deleteCertification
};
