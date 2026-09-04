import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  Code2,
  Mic,
  Target,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './ProgressPage.css';

const ProgressPage = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [resAss, resInt] = await Promise.allSettled([
          api.get('/assessments/history'),
          api.get('/interviews/history')
        ]);
        if (resAss.status === 'fulfilled' && resAss.value.data.success) {
          setAssessments(resAss.value.data.history);
        }
        if (resInt.status === 'fulfilled' && resInt.value.data.success) {
          setInterviews(resInt.value.data.history);
        }
      } catch (err) {
        console.warn('Error loading progress stats:', err.message);
      }
    };
    loadStats();
  }, []);

  const readinessHistory = [
    { month: 'June', score: 54 },
    { month: 'July', score: 65 },
    { month: 'August', score: user?.readinessScore?.overall || 78 }
  ];

  const assessmentScoreData = assessments.slice(0, 6).reverse().map((a, i) => ({
    name: `Test ${i + 1}`,
    score: a.scorePercentage || 0
  }));

  return (
    <div className="progress-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Career Readiness Progress & Analytics</h1>
          <p className="page-subtitle">
            Longitudinal growth metrics tracking your development from student foundation to placement readiness.
          </p>
        </div>
      </div>

      {/* Main Readiness Trajectory Chart */}
      <div className="glass-card progress-chart-card">
        <div className="card-header-row">
          <div>
            <h3 className="card-title">Career Readiness Trajectory</h3>
            <p className="card-subtitle">Month-over-month growth score</p>
          </div>
          <span className="badge badge-green">+24% Overall Improvement</span>
        </div>

        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <AreaChart data={readinessHistory}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#111322', borderColor: '#8b5cf6', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid-3 progress-metrics-grid">
        <div className="glass-card progress-metric-card">
          <div className="metric-header">
            <FileText size={20} className="text-purple" />
            <span className="badge badge-purple">Resume</span>
          </div>
          <div className="metric-val-big">{user?.readinessScore?.resume || 82}%</div>
          <p className="metric-desc">ATS keyword score and structured entity density.</p>
        </div>

        <div className="glass-card progress-metric-card">
          <div className="metric-header">
            <Code2 size={20} className="text-teal" />
            <span className="badge badge-teal">Coding</span>
          </div>
          <div className="metric-val-big">{user?.readinessScore?.coding || 72}%</div>
          <p className="metric-desc">Algorithmic correctness and Big-O complexity mastery.</p>
        </div>

        <div className="glass-card progress-metric-card">
          <div className="metric-header">
            <Mic size={20} className="text-amber" />
            <span className="badge badge-amber">Interview</span>
          </div>
          <div className="metric-val-big">{user?.readinessScore?.interview || 80}%</div>
          <p className="metric-desc">Technical articulation, STAR communication, problem solving.</p>
        </div>
      </div>

      {/* Assessment Performance Chart if available */}
      {assessmentScoreData.length > 0 && (
        <div className="glass-card assessment-history-chart-card">
          <h3 className="card-title">Recent Assessment Performance</h3>
          <p className="card-subtitle">Scores across completed timed coding tests</p>

          <div style={{ width: '100%', height: 220, marginTop: '1rem' }}>
            <ResponsiveContainer>
              <BarChart data={assessmentScoreData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#111322', borderColor: '#06b6d4', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
