import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Target,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Clock,
  Briefcase,
  GitCompare,
  BookOpen
} from 'lucide-react';
import './CareerGoalPage.css';

const CareerGoalPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [careerGoal, setCareerGoal] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.careerPreferences?.targetRole || 'Full Stack Developer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [targetTimeline, setTargetTimeline] = useState(6);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const roleDescriptions = {
    'Full Stack Developer': 'Architect modern client applications, resilient REST/GraphQL backend microservices, and databases.',
    'Frontend Developer': 'Craft performant, responsive user interfaces with React, modern CSS, state management, and accessibility.',
    'Backend Developer': 'Build scalable distributed APIs, database schemas, authentication systems, and cloud architectures.',
    'AI/ML Engineer': 'Train machine learning models, fine-tune neural networks, and deploy intelligent LLM pipelines with Python.',
    'Data Analyst': 'Extract business intelligence, write complex SQL aggregations, and build interactive PowerBI/Tableau dashboards.',
    'Java Developer': 'Develop enterprise-grade Spring Boot microservices, ORM persistence layers, and cloud infrastructure.',
    'Python Developer': 'Write asynchronous backend services, Django/FastAPI applications, and data extraction pipelines.',
    'DevOps Engineer': 'Automate CI/CD pipelines, containerize microservices with Docker/Kubernetes, and manage cloud infrastructure.',
    'UI/UX Designer': 'Design intuitive user experiences, wireframes, component design systems in Figma, and conduct usability tests.'
  };

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await api.get('/career');
        if (res.data.success) {
          setCareerGoal(res.data.careerGoal);
          setAvailableRoles(res.data.availableRoles || []);
          if (res.data.careerGoal?.targetRole) {
            setSelectedRole(res.data.careerGoal.targetRole);
          }
        }
      } catch (err) {
        console.warn('Failed to load career goal:', err.message);
      }
    };

    fetchGoal();
  }, []);

  const handleSaveGoal = async (roleToSet) => {
    const finalRole = roleToSet || (selectedRole === 'Custom Role' ? customRoleInput : selectedRole);
    if (!finalRole.trim()) return;

    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await api.post('/career/set-target', {
        targetRole: finalRole,
        targetTimelineMonths: targetTimeline
      });
      if (res.data.success) {
        setCareerGoal(res.data.careerGoal);
        setSuccessMsg(`Target goal set to "${finalRole}"! Skill gap benchmarks updated.`);
        await refreshUser();
      }
    } catch (err) {
      console.warn('Error setting career goal:', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="career-goal-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Target Career Goal Selection</h1>
          <p className="page-subtitle">
            Choose your target placement domain to calibrate skill gap algorithms, learning roadmaps, and AI mock interview questions.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="profile-alert success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Current Active Goal Banner */}
      {careerGoal && (
        <div className="current-goal-banner glass-card">
          <div className="goal-banner-left">
            <div className="goal-tag">
              <Target size={15} /> Active Placement Target
            </div>
            <h2 className="current-role-title">{careerGoal.targetRole}</h2>
            <p className="current-role-desc">
              {roleDescriptions[careerGoal.targetRole] || 'Custom career track tailored to your learning roadmap.'}
            </p>
          </div>

          <div className="goal-banner-right">
            <div className="goal-stat-item">
              <span className="goal-stat-val">{careerGoal.matchPercentage}%</span>
              <span className="goal-stat-lbl">Current Skill Match</span>
            </div>
            <div className="goal-stat-item">
              <span className="goal-stat-val">{careerGoal.acquiredSkills?.length || 0} / {careerGoal.requiredSkills?.length || 0}</span>
              <span className="goal-stat-lbl">Required Skills Met</span>
            </div>
            <button
              onClick={() => navigate('/skill-gap')}
              className="btn btn-primary btn-sm"
            >
              View Skill Gap <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Role Selection Grid */}
      <div className="role-selection-section">
        <h3 className="section-title-sm">Select Target Engineering Domain</h3>
        <div className="grid-3 roles-grid">
          {availableRoles.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <div
                key={role}
                className={`glass-card role-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedRole(role);
                  handleSaveGoal(role);
                }}
              >
                <div className="role-card-header">
                  <div className="role-card-title">{role}</div>
                  {isSelected && <span className="badge badge-purple">Active Target</span>}
                </div>
                <p className="role-card-desc">{roleDescriptions[role] || 'Industry-standard technical curriculum.'}</p>
                <div className="role-card-action">
                  <span className="select-action-text">
                    {isSelected ? '✓ Currently Selected' : 'Set as My Goal →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerGoalPage;
