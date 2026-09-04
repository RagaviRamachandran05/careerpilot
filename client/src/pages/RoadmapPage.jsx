import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Map,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ExternalLink,
  Code,
  Layers,
  RefreshCw,
  Zap,
  ArrowRight,
  CheckCircle,
  Play,
  Target
} from 'lucide-react';
import './RoadmapPage.css';

const RoadmapPage = () => {
  const { user, refreshUser } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [targetRole, setTargetRole] = useState(user?.careerPreferences?.targetRole || 'Full Stack Developer');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const roles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'AI/ML Engineer',
    'Data Analyst',
    'Java Developer',
    'Python Developer',
    'DevOps Engineer',
    'UI/UX Designer'
  ];

  const fetchRoadmap = async () => {
    try {
      const [resRoadmap, resRec] = await Promise.allSettled([
        api.get('/roadmap'),
        api.get('/roadmap/recommendations')
      ]);

      if (resRoadmap.status === 'fulfilled' && resRoadmap.value.data.success) {
        setRoadmap(resRoadmap.value.data.roadmap);
        if (resRoadmap.value.data.roadmap?.targetRole) {
          setTargetRole(resRoadmap.value.data.roadmap.targetRole);
        }
      }
      if (resRec.status === 'fulfilled' && resRec.value.data.success) {
        setRecommendation(resRec.value.data.recommendation);
      }
    } catch (err) {
      console.warn('Failed to load roadmap:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleStatusChange = async (topicId, newStatus) => {
    try {
      const res = await api.patch(`/roadmap/topics/${topicId}/status`, { status: newStatus });
      if (res.data.success) {
        setRoadmap(res.data.roadmap);
        if (newStatus === 'Completed') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.warn('Error updating topic status:', err.message);
    }
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    setSuccessMsg('');
    try {
      const res = await api.post('/roadmap/generate', {
        targetRole: targetRole
      });
      if (res.data.success) {
        setRoadmap(res.data.roadmap);
        setSuccessMsg(`AI Learning Roadmap re-generated for "${targetRole}" based on your current skill profile!`);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        await fetchRoadmap();
        await refreshUser();
      }
    } catch (err) {
      console.warn('Error generating roadmap:', err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="roadmap-page">
      {/* Page Header */}
      <div className="roadmap-header-row">
        <div>
          <h1 className="page-title">Personalized Learning Roadmap</h1>
          <p className="page-subtitle">
            AI-sequenced monthly milestones bridging missing competencies for {roadmap?.targetRole || targetRole}.
          </p>
        </div>

        <div className="roadmap-actions-top">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="roadmap-role-select"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={handleRegenerate}
            className="btn btn-primary btn-sm"
            disabled={generating}
          >
            {generating ? <RefreshCw size={15} className="spin-icon" /> : <Sparkles size={15} />}
            {generating ? 'Re-Generating...' : 'Re-Generate AI Roadmap'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="profile-alert success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* AI Next Step Recommendation Banner */}
      {recommendation && (
        <div className="glass-card ai-recommendation-banner">
          <div className="rec-icon-box">
            <Zap size={22} className="text-primary" />
          </div>
          <div className="rec-content">
            <div className="rec-badge">
              <Sparkles size={13} /> AI Personalized Recommendation
            </div>
            <h3 className="rec-title">Next Recommended Focus: {recommendation.currentFocus}</h3>
            <p className="rec-reason">{recommendation.reasoning}</p>
            <p className="rec-action">💡 <strong>Action Step:</strong> {recommendation.nextAction}</p>
          </div>
        </div>
      )}

      {/* Progress Overview Bar */}
      {roadmap && (
        <div className="glass-card roadmap-progress-card">
          <div className="progress-card-left">
            <div className="progress-title-row">
              <h3>{roadmap.title}</h3>
              <span className="badge badge-purple">{roadmap.progressPercentage}% Completed</span>
            </div>
            <p className="progress-overview-text">{roadmap.overview}</p>
            <div className="progress-bar-container" style={{ height: '10px', marginTop: '0.75rem' }}>
              <div className="progress-bar-fill" style={{ width: `${roadmap.progressPercentage}%` }} />
            </div>
          </div>

          <div className="progress-card-right">
            <div className="topics-count-badge">
              <span className="topics-num">{roadmap.completedTopics} / {roadmap.totalTopics}</span>
              <span className="topics-lbl">Topics Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Timeline Steps */}
      <div className="roadmap-timeline">
        {roadmap?.topics?.map((topic, index) => {
          const isCompleted = topic.status === 'Completed';
          const isInProgress = topic.status === 'In Progress';

          return (
            <div key={topic.topicId || index} className={`roadmap-step-card glass-card ${topic.status.toLowerCase().replace(' ', '-')}`}>
              {/* Step Header */}
              <div className="step-card-header">
                <div className="step-phase-badge">
                  <span className="phase-text">{topic.monthPhase || `Phase ${index + 1}`}</span>
                  <span className="category-text">• {topic.category}</span>
                </div>

                <div className="status-toggle-group">
                  <button
                    className={`status-btn ${topic.status === 'Not Started' ? 'active not-started' : ''}`}
                    onClick={() => handleStatusChange(topic.topicId, 'Not Started')}
                  >
                    Not Started
                  </button>
                  <button
                    className={`status-btn ${isInProgress ? 'active in-progress' : ''}`}
                    onClick={() => handleStatusChange(topic.topicId, 'In Progress')}
                  >
                    <Play size={12} /> In Progress
                  </button>
                  <button
                    className={`status-btn ${isCompleted ? 'active completed' : ''}`}
                    onClick={() => handleStatusChange(topic.topicId, 'Completed')}
                  >
                    <CheckCircle size={12} /> Completed
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="step-body">
                <h3 className="step-title">{topic.title}</h3>
                <p className="step-desc">{topic.description}</p>

                {/* Metadata Row */}
                <div className="step-meta-row">
                  <span className="meta-pill">
                    <Clock size={13} /> {topic.estimatedHours} Hours
                  </span>
                  <span className={`meta-pill difficulty-${topic.difficulty?.toLowerCase()}`}>
                    ⚡ {topic.difficulty} Difficulty
                  </span>
                  {topic.prerequisites?.length > 0 && (
                    <span className="meta-pill">
                      Prereq: {topic.prerequisites.join(', ')}
                    </span>
                  )}
                </div>

                {/* Key Concepts */}
                {topic.keyConcepts?.length > 0 && (
                  <div className="step-concepts-box">
                    <span className="concepts-lbl">Key Concepts:</span>
                    <div className="tags-cloud">
                      {topic.keyConcepts.map((kc, i) => (
                        <span key={i} className="skill-mini-tag">{kc}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Milestone Idea */}
                {topic.projectIdea?.title && (
                  <div className="step-project-box">
                    <div className="proj-box-header">
                      <Code size={15} className="text-teal" />
                      <span className="proj-box-title">Recommended Milestone Project: {topic.projectIdea.title}</span>
                    </div>
                    <p className="proj-box-desc">{topic.projectIdea.description}</p>
                  </div>
                )}

                {/* Curated Resources */}
                {topic.recommendedResources?.length > 0 && (
                  <div className="step-resources-box">
                    <span className="resources-lbl">Curated Study Resources:</span>
                    <div className="resources-links-list">
                      {topic.recommendedResources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-link-chip"
                        >
                          <BookOpen size={13} />
                          <span>{res.title} ({res.provider || res.type})</span>
                          <ExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;
