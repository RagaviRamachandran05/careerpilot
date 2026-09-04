import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  GitCompare,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  BookOpen,
  Zap,
  TrendingUp
} from 'lucide-react';
import './SkillGapPage.css';

const SkillGapPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.careerPreferences?.targetRole || 'Full Stack Developer');
  const [loading, setLoading] = useState(true);

  const fetchSkillGap = async (role) => {
    setLoading(true);
    try {
      const res = await api.get(`/skills/gap-analysis?role=${encodeURIComponent(role)}`);
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        setAvailableRoles(res.data.availableRoles || []);
      }
    } catch (err) {
      console.warn('Failed to load skill gap:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(selectedRole);
  }, [selectedRole]);

  return (
    <div className="skill-gap-page">
      {/* Top Title & Role Filter */}
      <div className="skill-gap-header-row">
        <div>
          <h1 className="page-title">Skill Gap Analysis</h1>
          <p className="page-subtitle">
            Compare your acquired skills directly against industry standard requirements for your target placement role.
          </p>
        </div>

        <div className="role-dropdown-wrap">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-selector-input"
          >
            {availableRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {analysis && (
        <>
          {/* Hero Match Gauge Card */}
          <div className="glass-card skill-match-hero-card">
            <div className="hero-gauge-left">
              <div className="readiness-gauge-circle">
                <span className="readiness-pct">{analysis.matchPercentage}%</span>
                <span className="readiness-label">Match</span>
              </div>
              <div className="readiness-summary-text">
                <div className="summary-title-row">
                  <h2>{selectedRole} Readiness</h2>
                  <span className={`badge ${analysis.matchPercentage >= 75 ? 'badge-green' : analysis.matchPercentage >= 50 ? 'badge-teal' : 'badge-amber'}`}>
                    {analysis.readinessLevel}
                  </span>
                </div>
                <p className="summary-desc">
                  You possess <strong>{analysis.acquiredCount}</strong> out of <strong>{analysis.benchmarkTotal}</strong> core skills required by top engineering recruiters.
                </p>
              </div>
            </div>

            <div className="hero-gauge-right">
              <Link to="/roadmap" className="btn btn-primary">
                <BookOpen size={16} /> View Personalized Study Roadmap <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Acquired Skills vs Missing Skills Comparison Grid */}
          <div className="grid-2 skills-comparison-grid">
            {/* Acquired Skills Column */}
            <div className="glass-card comparison-column-card acquired-card">
              <div className="column-header">
                <div className="col-title-wrap">
                  <CheckCircle size={20} className="text-emerald" />
                  <h3 className="column-title">Acquired Competencies ({analysis.acquiredCount})</h3>
                </div>
                <span className="badge badge-green">Verified</span>
              </div>
              <p className="column-desc">
                Technologies and tools currently present in your profile matching {selectedRole} requirements:
              </p>

              <div className="skills-status-list">
                {analysis.acquiredSkills.length > 0 ? (
                  analysis.acquiredSkills.map((skill, idx) => (
                    <div key={idx} className="skill-status-item acquired-item">
                      <span className="status-icon">✓</span>
                      <span className="skill-name">{skill}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-sm">No matched skills yet. Add skills in your profile!</div>
                )}
              </div>
            </div>

            {/* Missing Skills Column */}
            <div className="glass-card comparison-column-card missing-card">
              <div className="column-header">
                <div className="col-title-wrap">
                  <XCircle size={20} className="text-rose" />
                  <h3 className="column-title">Missing Skills to Master ({analysis.missingCount})</h3>
                </div>
                <span className="badge badge-red">Gap Identified</span>
              </div>
              <p className="column-desc">
                High-priority skills required for {selectedRole} placement interviews that you need to learn:
              </p>

              <div className="skills-status-list">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, idx) => (
                    <div key={idx} className="skill-status-item missing-item">
                      <span className="status-icon">❌</span>
                      <span className="skill-name">{skill}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-sm text-emerald">🎉 Congratulations! You have acquired 100% of the benchmark skills.</div>
                )}
              </div>

              {analysis.missingSkills.length > 0 && (
                <div className="missing-action-box">
                  <p className="missing-hint">
                    Our AI has dynamically curated a multi-phase learning pathway to bridge these exact {analysis.missingCount} gaps.
                  </p>
                  <Link to="/roadmap" className="btn btn-secondary btn-sm">
                    <Sparkles size={14} /> Open AI Roadmap
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGapPage;
