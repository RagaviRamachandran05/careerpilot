import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  Play,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import './AssessmentsPage.css';

const AssessmentsPage = () => {
  const { user, refreshUser } = useAuth();

  const [activeAssessment, setActiveAssessment] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalTaken: 0, avgScore: 0 });
  const [difficulty, setDifficulty] = useState('Mixed');
  const [questionCount, setQuestionCount] = useState(4);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/assessments/history');
      if (res.data.success) {
        setHistory(res.data.history || []);
        setStats(res.data.stats || { totalTaken: 0, avgScore: 0 });
      }
    } catch (err) {
      console.warn('Failed to load assessment history:', err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Assessment Countdown Timer
  useEffect(() => {
    if (!activeAssessment || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAssessment, timeLeft]);

  const handleStartAssessment = async () => {
    setStarting(true);
    setResult(null);
    setErrorMsg('');
    setShowAnswer(false);

    try {
      const res = await api.post('/assessments/start', {
        difficulty,
        questionCount,
        durationMinutes: questionCount * 10
      });
      if (res.data.success && res.data.assessment) {
        setActiveAssessment(res.data.assessment);
        setCurrentQIndex(0);
        setTimeLeft(res.data.assessment.durationMinutes * 60);
      } else {
        setErrorMsg(res.data.message || 'Could not start assessment.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error starting assessment. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const handleCodeChange = (newCode) => {
    if (!activeAssessment) return;
    const updatedQuestions = [...activeAssessment.questions];
    updatedQuestions[currentQIndex].userCode = newCode;
    setActiveAssessment({ ...activeAssessment, questions: updatedQuestions });
  };

  const handleResetCurrentCode = () => {
    if (!activeAssessment) return;
    const currentQ = activeAssessment.questions[currentQIndex];
    const starterTemplate = `// Write your JavaScript solution for ${currentQ.title}\nfunction solve() {\n  \n}\n`;
    handleCodeChange(starterTemplate);
  };

  const handleCopySolution = () => {
    const currentQ = activeAssessment?.questions?.[currentQIndex];
    if (currentQ?.solutionCode) {
      navigator.clipboard.writeText(currentQ.solutionCode);
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 2000);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!activeAssessment) return;
    setSubmitting(true);
    try {
      const timeSpent = (activeAssessment.durationMinutes * 60) - timeLeft;
      const res = await api.post(`/assessments/${activeAssessment._id}/submit`, {
        questions: activeAssessment.questions,
        timeSpentSeconds: timeSpent
      });

      if (res.data.success) {
        setResult(res.data.assessment);
        setActiveAssessment(null);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        await fetchHistory();
        await refreshUser();
      }
    } catch (err) {
      console.warn('Error submitting assessment:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = activeAssessment?.questions?.[currentQIndex];

  return (
    <div className="assessments-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Timed Coding Assessments</h1>
          <p className="page-subtitle">
            Simulate high-pressure campus placement coding tests with clean starter code and instant feedback.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="assessment-alert error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ACTIVE ASSESSMENT INTERFACE */}
      {activeAssessment ? (
        <div className="active-assessment-container">
          {/* Assessment Header Bar */}
          <div className="glass-card test-header-bar">
            <div className="test-header-left">
              <span className="badge badge-purple">{activeAssessment.difficulty} Assessment</span>
              <h2 className="test-title">{activeAssessment.title}</h2>
            </div>

            <div className="test-header-right">
              <div className={`timer-box ${timeLeft < 300 ? 'timer-urgent' : ''}`}>
                <Clock size={16} />
                <span className="timer-val">{formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={handleSubmitAssessment}
                className="btn btn-primary btn-sm"
                disabled={submitting}
              >
                <CheckCircle2 size={16} /> {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>

          {/* Question Navigation Bar */}
          <div className="question-nav-strip">
            {activeAssessment.questions.map((q, idx) => (
              <button
                key={idx}
                className={`q-nav-pill ${currentQIndex === idx ? 'active' : ''} ${q.userCode?.trim().length > 30 ? 'answered' : ''}`}
                onClick={() => {
                  setCurrentQIndex(idx);
                  setShowAnswer(false);
                }}
              >
                Q{idx + 1}: {q.title}
              </button>
            ))}
          </div>

          {/* Question Workspace Split */}
          <div className="grid-2 assessment-split-grid">
            {/* Left: Question Prompt */}
            <div className="glass-card q-prompt-card">
              <div className="q-prompt-header">
                <span className="q-index-badge">Question {currentQIndex + 1} of {activeAssessment.questions.length}</span>
                <span className="badge badge-teal">{currentQ?.category}</span>
              </div>
              <h3 className="q-title-large">{currentQ?.title}</h3>
              {currentQ?.description && (
                <p className="q-desc-text">{currentQ.description}</p>
              )}
              <p className="q-instructions">
                Implement an optimal algorithm in JavaScript. Write clean, modular code that passes boundary test cases.
              </p>

              {/* Show Answer Toggle for Assessment */}
              <div className="assessment-solution-section">
                <button
                  className={`btn ${showAnswer ? 'btn-secondary' : 'btn-outline'} btn-sm solution-toggle-btn`}
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showAnswer ? 'Hide Solution' : 'Show Answer & Explanation'}</span>
                </button>

                {showAnswer && (
                  <div className="solution-reveal-card glass-card">
                    <div className="solution-card-top">
                      <span className="badge badge-teal">Model Solution (JavaScript)</span>
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={handleCopySolution}
                      >
                        {copiedAnswer ? <Check size={12} /> : <Copy size={12} />}
                        {copiedAnswer ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {currentQ?.solutionExplanation && (
                      <p className="solution-explanation-text">
                        <strong>💡 Logic:</strong> {currentQ.solutionExplanation}
                      </p>
                    )}

                    <pre className="solution-code-block">
                      <code>{currentQ?.solutionCode || '// Solution not available'}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code Input Area */}
            <div className="glass-card q-editor-card">
              <div className="q-editor-header">
                <span className="editor-lang-tag">JavaScript Editor</span>
                <button
                  className="btn btn-outline btn-xs"
                  onClick={handleResetCurrentCode}
                  title="Reset code template"
                >
                  <RotateCcw size={12} /> Reset Template
                </button>
              </div>
              <textarea
                className="test-code-textarea"
                value={currentQ?.userCode || ''}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck="false"
                rows="16"
                placeholder="// Write your solution here..."
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="assessment-footer-actions">
            <button
              className="btn btn-outline"
              disabled={currentQIndex === 0}
              onClick={() => {
                setCurrentQIndex(prev => prev - 1);
                setShowAnswer(false);
              }}
            >
              <ChevronLeft size={16} /> Previous Question
            </button>
            <button
              className="btn btn-primary"
              disabled={currentQIndex === activeAssessment.questions.length - 1}
              onClick={() => {
                setCurrentQIndex(prev => prev + 1);
                setShowAnswer(false);
              }}
            >
              Next Question <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* ASSESSMENT START & HISTORY VIEW */
        <>
          {/* Assessment Result Banner if recently submitted */}
          {result && (
            <div className="glass-card assessment-result-card">
              <div className="result-header">
                <Award size={32} className="text-primary" />
                <div>
                  <h2 className="result-title">Assessment Completed!</h2>
                  <p className="result-sub">Solved {result.solvedCount} out of {result.totalQuestions} questions.</p>
                </div>
                <div className="result-score-badge">
                  <span className="score-val">{result.scorePercentage}%</span>
                  <span className="score-lbl">Score</span>
                </div>
              </div>

              <div className="grid-2 result-insights-grid">
                <div className="insight-box strong-box">
                  <h4>🟢 Strong Areas:</h4>
                  <ul>
                    {result.strongAreas?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="insight-box needs-box">
                  <h4>🟡 Needs Improvement:</h4>
                  <ul>
                    {result.needsImprovement?.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="result-ai-summary">🤖 {result.aiSummary}</p>
            </div>
          )}

          {/* Start New Assessment Card */}
          <div className="glass-card start-assessment-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Launch New Coding Assessment</h3>
                <p className="card-subtitle">Select desired difficulty and test duration</p>
              </div>
              <Timer size={24} className="text-primary" />
            </div>

            <div className="assessment-config-row">
              <div className="config-group">
                <label>Difficulty Tier</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Mixed">Mixed (Standard Campus Test)</option>
                  <option value="Easy">Easy (Foundation Level)</option>
                  <option value="Medium">Medium (Tier-1 SDE Level)</option>
                  <option value="Hard">Hard (FAANG Level)</option>
                </select>
              </div>

              <div className="config-group">
                <label>Number of Questions</label>
                <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}>
                  <option value="2">2 Questions (20 Mins)</option>
                  <option value="4">4 Questions (40 Mins)</option>
                  <option value="6">6 Questions (60 Mins)</option>
                </select>
              </div>

              <button
                onClick={handleStartAssessment}
                className="btn btn-primary start-test-btn"
                disabled={starting}
              >
                <Play size={16} /> {starting ? 'Preparing Test...' : 'Start Assessment'}
              </button>
            </div>
          </div>

          {/* Assessment History */}
          <div className="glass-card history-card">
            <h3 className="card-title">Past Assessment History</h3>
            <p className="card-subtitle">Performance trajectory across campus readiness tests</p>

            {history.length === 0 ? (
              <div className="empty-state">
                <Timer size={40} className="empty-state-icon" />
                <div className="empty-state-title">No assessments taken yet</div>
                <p className="empty-state-desc">Launch your first timed assessment above to record your score!</p>
              </div>
            ) : (
              <div className="history-table-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Test Title</th>
                      <th>Difficulty</th>
                      <th>Solved</th>
                      <th>Score</th>
                      <th>Date Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id}>
                        <td className="font-bold">{item.title}</td>
                        <td><span className="badge badge-purple">{item.difficulty}</span></td>
                        <td>{item.solvedCount} / {item.totalQuestions}</td>
                        <td>
                          <span className={`badge ${item.scorePercentage >= 75 ? 'badge-green' : item.scorePercentage >= 50 ? 'badge-teal' : 'badge-amber'}`}>
                            {item.scorePercentage}%
                          </span>
                        </td>
                        <td className="text-muted">
                          {new Date(item.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentsPage;
