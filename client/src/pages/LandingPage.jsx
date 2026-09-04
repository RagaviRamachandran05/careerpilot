import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  GitCompare,
  Code2,
  Mic,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated, demoStudentLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoStudent = async () => {
    await demoStudentLogin();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: FileText,
      title: 'AI Resume & ATS Analyzer',
      description: 'Upload your PDF resume to receive an instantaneous 0-100 ATS score, category breakdown, and role-specific keyword suggestions.'
    },
    {
      icon: GitCompare,
      title: 'Real-Time Skill Gap Analysis',
      description: 'Compare your acquired tech stack directly against industry benchmark requirements for your dream job role.'
    },
    {
      icon: Target,
      title: 'Personalized Learning Roadmaps',
      description: 'AI-generated multi-phase curricula with curated resources, estimated study hours, and project milestones.'
    },
    {
      icon: Code2,
      title: 'Coding Practice & AI Explanations',
      description: 'Solve problems across 12 algorithmic categories with clean starter templates, Big-O complexity feedback, and on-demand model solutions.'
    },
    {
      icon: Mic,
      title: 'Voice & Text AI Mock Interviews',
      description: 'Realistic technical & HR mock interviews tailored to your exact projects and resume with real-time scoring and STAR feedback.'
    },
    {
      icon: Briefcase,
      title: 'Explainable Job Match Engine',
      description: 'Discover relevant campus and off-campus placements with transparent match percentages and actionable advice on what to learn.'
    }
  ];

  const studentJourneySteps = [
    { step: '01', title: 'Create Profile', desc: 'Add your college, department, acquired skills & live project links.' },
    { step: '02', title: 'Upload Resume', desc: 'Extract structured credentials & evaluate ATS readiness score.' },
    { step: '03', title: 'Analyze Skill Gap', desc: 'Identify critical missing tools against top-tier tech job standards.' },
    { step: '04', title: 'Master Roadmap', desc: 'Complete curated study phases & build recommended portfolio apps.' },
    { step: '05', title: 'Practice & Assess', desc: 'Test coding speed with timed assessments and AI logic reviews.' },
    { step: '06', title: 'Ace AI Interviews', desc: 'Simulate high-stakes technical rounds and secure your placement.' }
  ];

  return (
    <div className="landing-page-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <div className="brand-logo">
            <Sparkles size={20} />
          </div>
          <span className="brand-title">CareerPilot <span className="gradient-text">AI</span></span>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#journey">Student Journey</a>
          <a href="#demo">Demo Access</a>
        </div>

        <div className="landing-nav-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Open Workspace <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/auth?tab=register" className="btn btn-primary btn-sm">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-badge">
          <Zap size={14} />
          <span>Self-Paced Career Development & Placement Acceleration Platform</span>
        </div>

        <h1 className="hero-title">
          Bridge the Gap from <span className="gradient-text">College Student</span> to <span className="gradient-text">Industry Ready Engineer</span>
        </h1>

        <p className="hero-subtitle">
          An end-to-end AI career development ecosystem. Analyze your resume, identify skill gaps, master custom learning roadmaps, practice algorithmic coding, and conquer AI mock interviews.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta-group">
          <Link to="/auth?tab=register" className="btn btn-primary btn-lg">
            Start Free Student Journey <ArrowRight size={18} />
          </Link>
          <button onClick={handleDemoStudent} className="btn btn-secondary btn-lg">
            <Sparkles size={18} /> Explore Demo Student
          </button>
        </div>

        {/* Showcase Stats Banner */}
        <div className="hero-stats-banner glass-card">
          <div className="stat-banner-item">
            <span className="banner-val">76%</span>
            <span className="banner-lbl">Avg Career Readiness</span>
          </div>
          <div className="stat-banner-divider" />
          <div className="stat-banner-item">
            <span className="banner-val">12+</span>
            <span className="banner-lbl">DSA Categories & AI Feedback</span>
          </div>
          <div className="stat-banner-divider" />
          <div className="stat-banner-item">
            <span className="banner-val">0 - 100</span>
            <span className="banner-lbl">ATS Resume Scoring</span>
          </div>
          <div className="stat-banner-divider" />
          <div className="stat-banner-item">
            <span className="banner-val">100%</span>
            <span className="banner-lbl">Explainable Job Matching</span>
          </div>
        </div>
      </header>

      {/* Student Journey Section */}
      <section id="journey" className="journey-section">
        <div className="section-header">
          <h2 className="section-title">The Complete Student Journey</h2>
          <p className="section-subtitle">
            From your first year on campus to final placement day, CareerPilot AI guides every milestone.
          </p>
        </div>

        <div className="journey-grid">
          {studentJourneySteps.map((step, idx) => (
            <div key={idx} className="journey-card glass-card">
              <div className="journey-step-num">{step.step}</div>
              <h3 className="journey-card-title">{step.title}</h3>
              <p className="journey-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Engineered for Technical Excellence</h2>
          <p className="section-subtitle">
            Powered by intelligent NLP heuristics and Google Gemini LLM algorithms for deeply personalized insights.
          </p>
        </div>

        <div className="grid-3 features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card feature-card">
                <div className="feature-icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Access CTA Banner */}
      <section id="demo" className="demo-banner-section">
        <div className="glass-card demo-banner-card">
          <div className="demo-banner-content">
            <h2>Ready to experience CareerPilot AI?</h2>
            <p>
              Explore instantly with pre-populated student data to test resume analysis, coding practice, and mock interviews.
            </p>
            <div className="demo-actions">
              <button onClick={handleDemoStudent} className="btn btn-primary btn-lg">
                <Sparkles size={16} /> Launch Demo Student Workspace (Aarav Sharma)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-title">CareerPilot <span className="gradient-text">AI</span></span>
            <p>B.Tech Final-Year Capstone Project — Placement & Career Development Platform</p>
          </div>
          <div className="footer-tech-stack">
            <span>Built with MERN (MongoDB, Express, React, Node.js) + Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
