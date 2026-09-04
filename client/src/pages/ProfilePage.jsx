import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Save,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Personal & Education form state
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    education: {
      college: user?.education?.college || '',
      degree: user?.education?.degree || 'B.Tech',
      department: user?.education?.department || '',
      graduationYear: user?.education?.graduationYear || 2026,
      cgpa: user?.education?.cgpa || ''
    },
    careerPreferences: {
      targetRole: user?.careerPreferences?.targetRole || 'Full Stack Developer',
      preferredLocation: user?.careerPreferences?.preferredLocation || 'Bengaluru / Hybrid',
      preferredEmploymentType: user?.careerPreferences?.preferredEmploymentType || 'Full-time'
    }
  });

  // Skills state
  const [skills, setSkills] = useState({
    languages: user?.skills?.languages || ['JavaScript', 'Python', 'C++'],
    frameworks: user?.skills?.frameworks || ['React', 'Node.js', 'Express.js'],
    databases: user?.skills?.databases || ['MongoDB', 'PostgreSQL'],
    tools: user?.skills?.tools || ['Git', 'Docker', 'Postman'],
    softSkills: user?.skills?.softSkills || ['Problem Solving', 'Teamwork']
  });

  const [newSkillInput, setNewSkillInput] = useState({ category: 'languages', tag: '' });

  // Projects state
  const [projects, setProjects] = useState(user?.projects || []);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: ''
  });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Certifications state
  const [certifications, setCertifications] = useState(user?.certifications || []);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '', url: '' });
  const [showAddCertModal, setShowAddCertModal] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/profile', personalData);
      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!');
        await refreshUser();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillInput.tag.trim()) return;
    const cat = newSkillInput.category;
    const updatedCategory = [...skills[cat], newSkillInput.tag.trim()];
    const updatedSkills = { ...skills, [cat]: updatedCategory };

    setSkills(updatedSkills);
    setNewSkillInput({ ...newSkillInput, tag: '' });

    try {
      await api.put('/profile/skills', { skills: updatedSkills });
      await refreshUser();
    } catch (err) {
      console.warn('Error saving skill:', err.message);
    }
  };

  const handleRemoveSkill = async (category, skillToRemove) => {
    const updatedCategory = skills[category].filter(s => s !== skillToRemove);
    const updatedSkills = { ...skills, [category]: updatedCategory };

    setSkills(updatedSkills);
    try {
      await api.put('/profile/skills', { skills: updatedSkills });
      await refreshUser();
    } catch (err) {
      console.warn('Error removing skill:', err.message);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    try {
      const res = await api.post('/profile/projects', newProject);
      if (res.data.success) {
        setProjects(res.data.projects);
        setNewProject({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '' });
        setShowAddProjectModal(false);
        await refreshUser();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error adding project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await api.delete(`/profile/projects/${projectId}`);
      if (res.data.success) {
        setProjects(res.data.projects);
        await refreshUser();
      }
    } catch (err) {
      console.warn('Error deleting project:', err.message);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCert.name.trim() || !newCert.issuer.trim()) return;

    try {
      const res = await api.post('/profile/certifications', newCert);
      if (res.data.success) {
        setCertifications(res.data.certifications);
        setNewCert({ name: '', issuer: '', date: '', url: '' });
        setShowAddCertModal(false);
        await refreshUser();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error adding certification');
    }
  };

  const handleDeleteCert = async (certId) => {
    try {
      const res = await api.delete(`/profile/certifications/${certId}`);
      if (res.data.success) {
        setCertifications(res.data.certifications);
        await refreshUser();
      }
    } catch (err) {
      console.warn('Error deleting cert:', err.message);
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header-card glass-card">
        <div className="profile-avatar-large">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div className="profile-header-info">
          <div className="profile-name-row">
            <h2>{user?.name || 'Student Profile'}</h2>
            <span className="badge badge-purple">{user?.careerPreferences?.targetRole || 'Full Stack Developer'}</span>
          </div>
          <p className="profile-subtitle">
            {user?.education?.college || 'College of Engineering'} • {user?.education?.degree} ({user?.education?.department}) • CGPA: {user?.education?.cgpa || '8.8'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        <button
          className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <User size={16} /> Personal & Academics
        </button>
        <button
          className={`profile-tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <Code size={16} /> Skills Matrix ({Object.values(skills).flat().length})
        </button>
        <button
          className={`profile-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <Briefcase size={16} /> Projects ({projects.length})
        </button>
        <button
          className={`profile-tab ${activeTab === 'certifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('certifications')}
        >
          <Award size={16} /> Certifications ({certifications.length})
        </button>
      </div>

      {successMsg && (
        <div className="profile-alert success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: Personal & Education */}
      {activeTab === 'personal' && (
        <form className="glass-card profile-form-card" onSubmit={handleSaveProfile}>
          <h3 className="section-title-sm">Personal Information</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={personalData.name}
                onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={user?.email || ''} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={personalData.phone}
                onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Location / City</label>
              <input
                type="text"
                placeholder="Bengaluru, Karnataka"
                value={personalData.location}
                onChange={(e) => setPersonalData({ ...personalData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Professional Bio / Summary</label>
            <textarea
              rows="3"
              placeholder="Brief summary of your technical interests and career aspirations..."
              value={personalData.bio}
              onChange={(e) => setPersonalData({ ...personalData, bio: e.target.value })}
            />
          </div>

          <h3 className="section-title-sm" style={{ marginTop: '1.5rem' }}>Education & Academics</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label>College / University</label>
              <input
                type="text"
                value={personalData.education.college}
                onChange={(e) => setPersonalData({
                  ...personalData,
                  education: { ...personalData.education, college: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <select
                value={personalData.education.degree}
                onChange={(e) => setPersonalData({
                  ...personalData,
                  education: { ...personalData.education, degree: e.target.value }
                })}
              >
                <option value="B.Tech">B.Tech</option>
                <option value="B.E.">B.E.</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="M.Tech">M.Tech</option>
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={personalData.education.department}
                onChange={(e) => setPersonalData({
                  ...personalData,
                  education: { ...personalData.education, department: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                value={personalData.education.graduationYear}
                onChange={(e) => setPersonalData({
                  ...personalData,
                  education: { ...personalData.education, graduationYear: Number(e.target.value) }
                })}
              />
            </div>
            <div className="form-group">
              <label>CGPA / Percentage</label>
              <input
                type="text"
                placeholder="8.85 or 85%"
                value={personalData.education.cgpa}
                onChange={(e) => setPersonalData({
                  ...personalData,
                  education: { ...personalData.education, cgpa: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Skills Matrix */}
      {activeTab === 'skills' && (
        <div className="glass-card skills-matrix-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Technical & Soft Skills Portfolio</h3>
              <p className="card-subtitle">Add technologies and competencies you've worked with</p>
            </div>
          </div>

          {/* Add Skill Bar */}
          <div className="add-skill-bar">
            <select
              value={newSkillInput.category}
              onChange={(e) => setNewSkillInput({ ...newSkillInput, category: e.target.value })}
              className="skill-cat-select"
            >
              <option value="languages">Programming Languages</option>
              <option value="frameworks">Frameworks & Libraries</option>
              <option value="databases">Databases & Caching</option>
              <option value="tools">DevOps, Cloud & Tools</option>
              <option value="softSkills">Soft Skills & Communication</option>
            </select>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Docker, Redis..."
              value={newSkillInput.tag}
              onChange={(e) => setNewSkillInput({ ...newSkillInput, tag: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            <button type="button" onClick={handleAddSkill} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Skill
            </button>
          </div>

          {/* Categories */}
          <div className="skill-categories-grid">
            {[
              { key: 'languages', title: 'Programming Languages', color: 'purple' },
              { key: 'frameworks', title: 'Frameworks & Web Technologies', color: 'teal' },
              { key: 'databases', title: 'Databases & Storage', color: 'blue' },
              { key: 'tools', title: 'Tools & DevOps', color: 'amber' },
              { key: 'softSkills', title: 'Soft Skills & Behavioral', color: 'green' }
            ].map(cat => (
              <div key={cat.key} className="skill-cat-block">
                <div className="cat-title">{cat.title} ({skills[cat.key]?.length || 0})</div>
                <div className="tags-cloud">
                  {skills[cat.key]?.length > 0 ? (
                    skills[cat.key].map((s, idx) => (
                      <span key={idx} className={`tag-item badge-${cat.color}`}>
                        {s}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(cat.key, s)}
                          className="tag-remove-btn"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="no-tags-hint">No skills added yet</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Projects */}
      {activeTab === 'projects' && (
        <div className="glass-card projects-manager-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Portfolio Projects</h3>
              <p className="card-subtitle">Showcase software architecture, repositories, and deployed demos</p>
            </div>
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} /> Add New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <Code size={40} className="empty-state-icon" />
              <div className="empty-state-title">No projects added yet</div>
              <p className="empty-state-desc">
                Adding at least 2 full-stack or domain-relevant projects boosts your overall career readiness score by +15%!
              </p>
              <button onClick={() => setShowAddProjectModal(true)} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add First Project
              </button>
            </div>
          ) : (
            <div className="grid-2 projects-grid">
              {projects.map((proj) => (
                <div key={proj._id} className="project-item-card glass-card">
                  <div className="proj-card-header">
                    <h4 className="proj-title">{proj.title}</h4>
                    <button
                      onClick={() => handleDeleteProject(proj._id)}
                      className="proj-delete-btn"
                      title="Delete project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p className="proj-desc">{proj.description}</p>
                  <div className="proj-tech-tags">
                    {(proj.technologies || []).map((t, i) => (
                      <span key={i} className="skill-mini-tag">{t}</span>
                    ))}
                  </div>
                  <div className="proj-links">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="proj-link live-link">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Project Modal */}
          {showAddProjectModal && (
            <div className="modal-overlay">
              <div className="modal-content glass-card">
                <div className="modal-header">
                  <h3>Add Portfolio Project</h3>
                  <button onClick={() => setShowAddProjectModal(false)} className="close-modal-btn">×</button>
                </div>
                <form onSubmit={handleAddProject} className="modal-form">
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SkillSwap — Peer Code Review Portal"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description & Architectural Highlights</label>
                    <textarea
                      rows="3"
                      placeholder="Explain features, concurrency, performance wins..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Node.js, Express, MongoDB, Socket.io"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>GitHub Repository URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Live Hosted Application URL</label>
                      <input
                        type="url"
                        placeholder="https://myproject.vercel.app"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddProjectModal(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Certifications */}
      {activeTab === 'certifications' && (
        <div className="glass-card certs-manager-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Professional Certifications</h3>
              <p className="card-subtitle">AWS, Meta, Coursera, HackerRank, and academic credentials</p>
            </div>
            <button
              onClick={() => setShowAddCertModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} /> Add Certification
            </button>
          </div>

          {certifications.length === 0 ? (
            <div className="empty-state">
              <Award size={40} className="empty-state-icon" />
              <div className="empty-state-title">No certifications added</div>
              <p className="empty-state-desc">
                Adding industry-recognized credentials highlights your commitment to continuous technical learning.
              </p>
              <button onClick={() => setShowAddCertModal(true)} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add Certification
              </button>
            </div>
          ) : (
            <div className="grid-2 certs-grid">
              {certifications.map((cert) => (
                <div key={cert._id} className="cert-item-card glass-card">
                  <div className="cert-card-header">
                    <div className="cert-info">
                      <h4 className="cert-name">{cert.name}</h4>
                      <span className="cert-issuer">{cert.issuer} • {cert.date || 'Verified'}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCert(cert._id)}
                      className="proj-delete-btn"
                      title="Delete certification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noreferrer" className="cert-verify-link">
                      <ExternalLink size={13} /> View Certificate Credentials
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Cert Modal */}
          {showAddCertModal && (
            <div className="modal-overlay">
              <div className="modal-content glass-card">
                <div className="modal-header">
                  <h3>Add Certification</h3>
                  <button onClick={() => setShowAddCertModal(false)} className="close-modal-btn">×</button>
                </div>
                <form onSubmit={handleAddCert} className="modal-form">
                  <div className="form-group">
                    <label>Certification Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                      value={newCert.name}
                      onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon Web Services / Meta"
                      value={newCert.issuer}
                      onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Issue Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Jan 2025"
                        value={newCert.date}
                        onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Verification URL</label>
                      <input
                        type="url"
                        placeholder="https://coursera.org/verify/..."
                        value={newCert.url}
                        onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddCertModal(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Certification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
