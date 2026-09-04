import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Sparkles,
  FileText,
  GitCompare,
  Code2,
  Mic,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    resume: null,
    careerGoal: null,
    roadmap: null,
    topJobs: [],
    recentAttempts: [],
    recentInterviews: []
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [resResume, resGoal, resRoadmap, resJobs] = await Promise.allSettled([
          api.get('/resume/current'),
          api.get('/career'),
          api.get('/roadmap'),
          api.get('/jobs')
        ]);

        setDashboardData({
          resume: resResume.status === 'fulfilled' ? resResume.value.data.resume : null,
          careerGoal: resGoal.status === 'fulfilled' ? resGoal.value.data.careerGoal : null,
          roadmap: resRoadmap.status === 'fulfilled' ? resRoadmap.value.data.roadmap : null,
          topJobs: resJobs.status === 'fulfilled' ? (resJobs.value.data.jobs || []).slice(0, 3) : []
        });
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const scores = user?.readinessScore || {
    overall: 76,
    resume: 82,
    skills: 75,
    coding: 72,
    interview: 80,
    projects: 85
  };

  const radarData = [
    { subject: 'Resume ATS', value: scores.resume || 70, fullMark: 100 },
    { subject: 'Skill Match', value: scores.skills || 65, fullMark: 100 },
    { subject: 'Coding Speed', value: scores.coding || 60, fullMark: 100 },
    { subject: 'AI Interview', value: scores.interview || 75, fullMark: 100 },
    { subject: 'Projects', value: scores.projects || 80, fullMark: 100 }
  ];

  // Calculate profile completion percentage
  const calcProfileCompletion = () => {
    let completedFields = 0;
    const totalFields = 6;
    if (user?.name) completedFields++;
    if (user?.education?.college) completedFields++;
    if (user?.skills?.languages?.length > 0) completedFields++;
    if (user?.projects?.length > 0) completedFields++;
    if (dashboardData.resume) completedFields++;
    if (dashboardData.careerGoal) completedFields++;
    return Math.round((completedFields / totalFields) * 100);
  };

  const profilePct = calcProfileCompletion();

  return (
    <div className="dashboard-page">
      {/* Top Welcome Banner */}
      <div className="dashboard-welcome-card glass-card">
        <div className="welcome-left">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Target Role: {user?.careerPreferences?.targetRole || 'Full Stack Developer'}</span>
          </div>
          <h1 className="welcome-heading">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>! 👋
          </h1>
          <p className="welcome-desc">
            {user?.education?.college || 'IIIT / NIT'} • Batch of {user?.education?.graduationYear || 2026}
          </p>

          <div className="profile-completion-bar-wrap">
            <div className="completion-info">
              <span>Profile Completion</span>
              <span className="completion-pct">{profilePct}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${profilePct}%` }} />
            </div>
          </div>
        </div>

        <div className="welcome-right">
          <div className="readiness-gauge-box">
            <div className="gauge-circle">
              <span className="gauge-number">{scores.overall}%</span>
              <span className="gauge-sub">Readiness</span>
            </div>
            <div className="gauge-label">
              <span className="gauge-status">
                {scores.overall >= 75 ? '🔥 Placement Ready' : scores.overall >= 50 ? '⚡ Advancing Nicely' : '🌱 Getting Started'}
              </span>
              <span className="gauge-caption">Weighted algorithmic score</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid-4 stats-grid">
        <Link to="/resume" className="glass-card stat-card-link">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon icon-purple">
                <FileText size={22} />
              </div>
              <span className="badge badge-purple">ATS Evaluated</span>
            </div>
            <div className="stat-value">{scores.resume} <span className="stat-max">/ 100</span></div>
            <div className="stat-label">Resume ATS Score</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${scores.resume}%` }} />
            </div>
          </div>
        </Link>

        <Link to="/skill-gap" className="glass-card stat-card-link">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon icon-teal">
                <GitCompare size={22} />
              </div>
              <span className="badge badge-teal">Benchmark</span>
            </div>
            <div className="stat-value">{scores.skills}%</div>
            <div className="stat-label">Role Skill Match</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${scores.skills}%` }} />
            </div>
          </div>
        </Link>

        <Link to="/coding" className="glass-card stat-card-link">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon icon-blue">
                <Code2 size={22} />
              </div>
              <span className="badge badge-green">12 Categories</span>
            </div>
            <div className="stat-value">{scores.coding}%</div>
            <div className="stat-label">DSA & Coding Score</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${scores.coding}%` }} />
            </div>
          </div>
        </Link>

        <Link to="/interview" className="glass-card stat-card-link">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon icon-amber">
                <Mic size={22} />
              </div>
              <span className="badge badge-amber">AI Mock</span>
            </div>
            <div className="stat-value">{(scores.interview / 10).toFixed(1)} <span className="stat-max">/ 10</span></div>
            <div className="stat-label">Mock Interview Rating</div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${scores.interview}%` }} />
            </div>
          </div>
        </Link>
      </div>

      {/* Main Interactive Grid: Radar + Actionable Steps */}
      <div className="grid-2 dashboard-main-grid">
        {/* Readiness Radar Chart */}
        <div className="glass-card radar-chart-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Placement Competency Radar</h3>
              <p className="card-subtitle">Multi-dimensional assessment across core hiring pillars</p>
            </div>
            <span className="badge badge-purple">Real-time</span>
          </div>

          <div className="radar-container" style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" />
                <Radar
                  name="Readiness"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="radar-scoring-formula">
            <span>Formula: </span>
            <code>Resume (25%) + Skills (25%) + Coding (20%) + Interview (20%) + Projects (10%)</code>
          </div>
        </div>

        {/* Recommended Action Items */}
        <div className="glass-card action-items-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Recommended Next Steps</h3>
              <p className="card-subtitle">AI-curated high-impact milestones to boost your placement score</p>
            </div>
            <Zap size={20} className="text-primary" />
          </div>

          <div className="actions-list">
            <Link to="/roadmap" className="action-item">
              <div className="action-icon icon-teal">
                <BookOpen size={18} />
              </div>
              <div className="action-details">
                <span className="action-title">Master REST APIs & Express Routing</span>
                <span className="action-desc">Your backend API design score is 65%. Complete Topic 2 on your roadmap.</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>

            <Link to="/resume" className="action-item">
              <div className="action-icon icon-purple">
                <FileText size={18} />
              </div>
              <div className="action-details">
                <span className="action-title">Optimize Resume for Missing Keywords</span>
                <span className="action-desc">Add Docker, Redis, and measurable latency metrics to raise ATS score to 90+.</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>

            <Link to="/coding" className="action-item">
              <div className="action-icon icon-blue">
                <Code2 size={18} />
              </div>
              <div className="action-details">
                <span className="action-title">Practice Sliding Window & HashMap Algorithms</span>
                <span className="action-desc">Solve 2 medium problems to boost your coding evaluation metrics.</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>

            <Link to="/interview" className="action-item">
              <div className="action-icon icon-amber">
                <Mic size={18} />
              </div>
              <div className="action-details">
                <span className="action-title">Take a 5-Minute Technical Mock Interview</span>
                <span className="action-desc">Practice answering system design & MERN project architecture questions.</span>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Matching Job Placements */}
      <div className="glass-card top-jobs-card">
        <div className="card-header-row">
          <div>
            <h3 className="card-title">Top Matching Placement Opportunities</h3>
            <p className="card-subtitle">Personalized algorithm matches based on your tech stack and target role</p>
          </div>
          <Link to="/jobs" className="btn btn-secondary btn-sm">
            View All Job Matches <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid-3 jobs-preview-grid">
          {dashboardData.topJobs.length > 0 ? (
            dashboardData.topJobs.map((job) => (
              <div key={job._id} className="job-preview-item glass-card">
                <div className="job-preview-header">
                  <span className="job-preview-title">{job.title}</span>
                  <span className="badge badge-teal">{job.matchScore}% Match</span>
                </div>
                <div className="job-preview-company">{job.company} • {job.location}</div>
                <div className="job-preview-skills">
                  {(job.requiredSkills || []).slice(0, 4).map((s, i) => (
                    <span key={i} className="skill-mini-tag">{s}</span>
                  ))}
                </div>
                <div className="job-preview-footer">
                  <span className="job-preview-salary">{job.salary}</span>
                  <Link to="/jobs" className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <Briefcase size={36} className="text-muted" />
              <span>Loading matching job listings...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
