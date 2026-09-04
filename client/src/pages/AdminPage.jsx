import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Timer,
  Mic,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  BookOpen,
  Sparkles,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './AdminPage.css';

const AdminPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'students', 'jobs', 'resources'
  const [analytics, setAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Job Modal State
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Bengaluru (Hybrid)',
    experienceLevel: 'Fresher',
    salary: '₹10,00,000 - ₹15,00,000 / year',
    requiredSkills: '',
    description: '',
    applicationUrl: 'https://careers.google.com'
  });

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.warn('Failed to load admin analytics:', err.message);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/admin/students?search=${encodeURIComponent(studentSearch)}`);
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.warn('Failed to load students:', err.message);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.warn('Failed to load jobs:', err.message);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await api.get('/admin/resources');
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.warn('Failed to load resources:', err.message);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchStudents(), fetchJobs(), fetchResources()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [studentSearch]);

  const handleToggleStudentStatus = async (studentId) => {
    try {
      const res = await api.patch(`/admin/students/${studentId}/status`);
      if (res.data.success) {
        setStudents(prev => prev.map(s => s._id === studentId ? res.data.student : s));
      }
    } catch (err) {
      console.warn('Error toggling student status:', err.message);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.description) return;

    try {
      const res = await api.post('/admin/jobs', newJob);
      if (res.data.success) {
        setShowAddJobModal(false);
        setNewJob({
          title: '',
          company: '',
          location: 'Bengaluru (Hybrid)',
          experienceLevel: 'Fresher',
          salary: '₹10,00,000 - ₹15,00,000 / year',
          requiredSkills: '',
          description: '',
          applicationUrl: 'https://careers.google.com'
        });
        await fetchJobs();
        await fetchAnalytics();
      }
    } catch (err) {
      console.warn('Error creating job:', err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      await fetchJobs();
      await fetchAnalytics();
    } catch (err) {
      console.warn('Error deleting job:', err.message);
    }
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="admin-badge-top">
            <ShieldAlert size={15} /> Campus Placement Directorate
          </div>
          <h1 className="page-title">Placement Administration Portal</h1>
          <p className="page-subtitle">
            Oversee platform-wide student career readiness, job opportunities, coding assessments, and student progress metrics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart2 size={16} /> Platform Analytics
        </button>
        <button
          className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={16} /> Students Manager ({students.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={16} /> Placement Jobs ({jobs.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <BookOpen size={16} /> Learning Resources ({resources.length})
        </button>
      </div>

      {/* TAB 1: Platform Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="admin-analytics-view">
          {/* 4 Stats Cards */}
          <div className="grid-4 stats-grid">
            <div className="glass-card stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-purple"><Users size={22} /></div>
                <span className="badge badge-purple">Enrolled</span>
              </div>
              <div className="stat-value">{analytics.stats.totalStudents}</div>
              <div className="stat-label">Total Student Cohort</div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-teal"><Briefcase size={22} /></div>
                <span className="badge badge-teal">Active</span>
              </div>
              <div className="stat-value">{analytics.stats.totalJobs}</div>
              <div className="stat-label">Verified Placement Jobs</div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-blue"><Timer size={22} /></div>
                <span className="badge badge-green">Completed</span>
              </div>
              <div className="stat-value">{analytics.stats.totalAssessments}</div>
              <div className="stat-label">Coding Assessments Taken</div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-amber"><Mic size={22} /></div>
                <span className="badge badge-amber">Conducted</span>
              </div>
              <div className="stat-value">{analytics.stats.totalInterviews}</div>
              <div className="stat-label">AI Mock Interviews</div>
            </div>
          </div>

          {/* Platform Averages Row */}
          <div className="glass-card cohort-averages-card">
            <h3 className="card-title">Campus Benchmark Averages</h3>
            <div className="grid-4 averages-grid">
              <div className="avg-item">
                <span className="avg-val">{analytics.stats.avgReadiness}%</span>
                <span className="avg-lbl">Avg Career Readiness</span>
              </div>
              <div className="avg-item">
                <span className="avg-val">{analytics.stats.avgResume} / 100</span>
                <span className="avg-lbl">Avg ATS Resume Score</span>
              </div>
              <div className="avg-item">
                <span className="avg-val">{analytics.stats.avgCoding}%</span>
                <span className="avg-lbl">Avg Coding Performance</span>
              </div>
              <div className="avg-item">
                <span className="avg-val">{analytics.stats.avgInterview}%</span>
                <span className="avg-lbl">Avg Mock Interview Score</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid-2 admin-charts-grid">
            <div className="glass-card admin-chart-card">
              <h3 className="card-title">Student Target Roles Distribution</h3>
              <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
                <ResponsiveContainer>
                  <BarChart data={analytics.roleDistribution}>
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#111322', borderColor: '#8b5cf6', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card admin-chart-card">
              <h3 className="card-title">Placement Readiness Brackets</h3>
              <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analytics.readinessBrackets}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {analytics.readinessBrackets?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111322', borderColor: '#06b6d4', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Students Manager */}
      {activeTab === 'students' && (
        <div className="glass-card admin-students-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Enrolled Students Directory</h3>
              <p className="card-subtitle">Monitor individual student readiness, target roles, and activity status</p>
            </div>

            <div className="student-search-box">
              <Search size={15} className="text-muted" />
              <input
                type="text"
                placeholder="Search by name, email, college..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>College & Branch</th>
                  <th>Target Role</th>
                  <th>Career Readiness</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <div className="st-name-cell">
                        <span className="font-bold">{st.name}</span>
                        <span className="text-muted text-xs">{st.email}</span>
                      </div>
                    </td>
                    <td>{st.education?.college || 'College'} • {st.education?.department || 'CSE'}</td>
                    <td><span className="badge badge-purple">{st.careerPreferences?.targetRole || 'Full Stack'}</span></td>
                    <td>
                      <span className={`badge ${st.readinessScore?.overall >= 75 ? 'badge-green' : 'badge-teal'}`}>
                        {st.readinessScore?.overall || 70}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${st.isActive !== false ? 'badge-green' : 'badge-red'}`}>
                        {st.isActive !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStudentStatus(st._id)}
                        className={`btn ${st.isActive !== false ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                      >
                        {st.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Placement Jobs Manager */}
      {activeTab === 'jobs' && (
        <div className="glass-card admin-jobs-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Placement Job Postings</h3>
              <p className="card-subtitle">Manage campus placement and off-campus corporate drives</p>
            </div>
            <button onClick={() => setShowAddJobModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Post New Job
            </button>
          </div>

          <div className="grid-2 jobs-management-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-admin-card glass-card">
                <div className="job-admin-header">
                  <div>
                    <h4 className="job-title">{job.title}</h4>
                    <span className="job-company">{job.company} • {job.location}</span>
                  </div>
                  <button onClick={() => handleDeleteJob(job._id)} className="proj-delete-btn" title="Delete job">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="job-desc-sm">{job.description}</p>
                <div className="job-skills-preview">
                  {(job.requiredSkills || []).map((s, i) => (
                    <span key={i} className="skill-mini-tag">{s}</span>
                  ))}
                </div>
                <div className="job-admin-footer">
                  <span className="job-salary">{job.salary}</span>
                  <span className="badge badge-teal">{job.experienceLevel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Job Modal */}
          {showAddJobModal && (
            <div className="modal-overlay">
              <div className="modal-content glass-card">
                <div className="modal-header">
                  <h3>Post New Placement Job</h3>
                  <button onClick={() => setShowAddJobModal(false)} className="close-modal-btn">×</button>
                </div>
                <form onSubmit={handleCreateJob} className="modal-form">
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full Stack Engineer (MERN)"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Hiring Company *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Atlassian / Swiggy"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Job Location</label>
                      <input
                        type="text"
                        placeholder="Bengaluru (Hybrid)"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Experience Tier</label>
                      <select
                        value={newJob.experienceLevel}
                        onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                      >
                        <option value="Fresher">Fresher / Graduate</option>
                        <option value="0-1 Years">0-1 Years</option>
                        <option value="1-3 Years">1-3 Years</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Salary Package</label>
                      <input
                        type="text"
                        placeholder="₹12,00,000 - ₹18,00,000 / year"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Required Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Node.js, Express, MongoDB, REST API"
                      value={newJob.requiredSkills}
                      onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Description *</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Detailed responsibilities and eligibility criteria..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowAddJobModal(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Publish Job Listing
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Learning Resources */}
      {activeTab === 'resources' && (
        <div className="glass-card admin-resources-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Curated Learning Resources</h3>
              <p className="card-subtitle">Official documentation, interactive courses, and interview guides</p>
            </div>
          </div>

          <div className="grid-2 resources-grid">
            {resources.map((res) => (
              <div key={res._id} className="resource-admin-card glass-card">
                <div className="res-header">
                  <h4 className="res-title">{res.title}</h4>
                  <span className="badge badge-purple">{res.type}</span>
                </div>
                <p className="res-provider">{res.provider} • Difficulty: {res.difficulty}</p>
                <div className="tags-cloud">
                  {(res.skillTags || []).map((t, i) => (
                    <span key={i} className="skill-mini-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
