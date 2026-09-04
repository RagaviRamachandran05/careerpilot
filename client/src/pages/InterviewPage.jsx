import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Volume2,
  User,
  Bot,
  Lightbulb,
  Clock,
  ArrowRight,
  TrendingUp,
  Trash2
} from 'lucide-react';
import './InterviewPage.css';

const InterviewPage = () => {
  const { user, refreshUser } = useAuth();

  const [activeInterview, setActiveInterview] = useState(null);
  const [interviewType, setInterviewType] = useState('Mixed');
  const [targetRole, setTargetRole] = useState(user?.careerPreferences?.targetRole || 'Full Stack Developer');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalInterviews: 0, completedCount: 0, averageScore: 0 });
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [lastQuestionEval, setLastQuestionEval] = useState(null);

  const recognitionRef = useRef(null);
  const baseAnswerRef = useRef(''); // Stores text before speech started

  // Initialize Web Speech API cleanly without repetitive duplicates
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const base = baseAnswerRef.current ? baseAnswerRef.current.trim() + ' ' : '';
        const combined = (base + finalTranscript + interimTranscript).trimStart();
        setStudentAnswer(combined);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setSpeechSupported(true);
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/interviews/history');
      if (res.data.success) {
        setHistory(res.data.history);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Failed to load interview history:', err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        baseAnswerRef.current = studentAnswer; // Save text typed prior to speaking
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const handleStartInterview = async () => {
    setStarting(true);
    setLastQuestionEval(null);
    setStudentAnswer('');
    baseAnswerRef.current = '';
    try {
      const res = await api.post('/interviews/start', {
        targetRole,
        interviewType
      });
      if (res.data.success) {
        setActiveInterview(res.data.interview);
      }
    } catch (err) {
      console.warn('Error starting interview:', err.message);
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activeInterview || !studentAnswer.trim()) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setEvaluating(true);
    try {
      const currentIdx = activeInterview.currentQuestionIndex;
      const res = await api.post(`/interviews/${activeInterview._id}/answer`, {
        questionIndex: currentIdx,
        studentAnswer: studentAnswer.trim(),
        answerMode: isListening ? 'Voice' : 'Text'
      });

      if (res.data.success) {
        setActiveInterview(res.data.interview);
        setLastQuestionEval(res.data.currentEvaluation);
        setStudentAnswer('');
        baseAnswerRef.current = '';

        if (res.data.isCompleted) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          await fetchHistory();
          await refreshUser();
        }
      }
    } catch (err) {
      console.warn('Error submitting answer:', err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = activeInterview?.questions?.[activeInterview.currentQuestionIndex];
  const isInterviewFinished = activeInterview?.status === 'Completed';

  return (
    <div className="interview-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">AI Mock Interview Simulator</h1>
          <p className="page-subtitle">
            Practice realistic Technical & HR rounds with personalized questions tailored to your projects, resume, and target role.
          </p>
        </div>
      </div>

      {/* ACTIVE INTERVIEW ROOM */}
      {activeInterview ? (
        <div className="interview-room-container">
          {/* Header */}
          <div className="glass-card room-header-bar">
            <div className="room-header-left">
              <span className="badge badge-purple">{activeInterview.interviewType} Interview</span>
              <h2 className="room-role-title">Target: {activeInterview.targetRole}</h2>
            </div>

            <div className="room-header-right">
              <span className="q-progress-tag">
                {isInterviewFinished ? 'Session Finished' : `Question ${activeInterview.currentQuestionIndex + 1} of ${activeInterview.questions.length}`}
              </span>
            </div>
          </div>

          {!isInterviewFinished && currentQ ? (
            /* ACTIVE QUESTION INTERACTION */
            <div className="grid-2 interview-active-split">
              {/* Left: AI Interviewer Question Box */}
              <div className="glass-card ai-interviewer-card">
                <div className="interviewer-header">
                  <div className="bot-avatar">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="interviewer-name">AI Hiring Director</h3>
                    <span className="interviewer-category">Category: {currentQ.category}</span>
                  </div>
                </div>

                {currentQ.contextReference && (
                  <div className="context-ref-chip">
                    <Sparkles size={13} /> {currentQ.contextReference}
                  </div>
                )}

                <div className="question-dialogue-box">
                  <p className="question-text">"{currentQ.questionText}"</p>
                </div>

                {/* Expected key points teaser */}
                <div className="hints-box-subtle">
                  <span className="hints-lbl">Expected Focus Areas:</span>
                  <p className="hints-text">Structure your answer covering core architecture, implementation details, trade-offs, and examples from your projects.</p>
                </div>

                {/* Previous question instant evaluation if available */}
                {lastQuestionEval && (
                  <div className="last-eval-preview glass-card">
                    <span className="eval-prev-title">Previous Question Score: {lastQuestionEval.overallScore} / 10</span>
                    <p className="eval-prev-feedback">💡 {lastQuestionEval.feedback}</p>
                  </div>
                )}
              </div>

              {/* Right: Student Response Console */}
              <div className="glass-card student-response-card">
                <div className="response-card-header">
                  <div className="user-indicator">
                    <User size={18} className="text-primary" />
                    <span>Your Answer</span>
                  </div>

                  <div className="voice-controls-row">
                    {speechSupported && (
                      <button
                        type="button"
                        className={`voice-toggle-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleVoiceRecording}
                        title={isListening ? 'Click to pause microphone' : 'Click to start speaking'}
                      >
                        {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                        <span>{isListening ? 'Recording (Listening...)' : 'Voice Dictate'}</span>
                      </button>
                    )}

                    {studentAnswer && (
                      <button
                        type="button"
                        className="btn-clear-answer"
                        onClick={() => {
                          setStudentAnswer('');
                          baseAnswerRef.current = '';
                        }}
                        title="Clear text"
                      >
                        <Trash2 size={14} /> Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  className="student-answer-input"
                  rows="12"
                  placeholder="Type your structured answer here, or click 'Voice Dictate' to speak via microphone..."
                  value={studentAnswer}
                  onChange={(e) => {
                    setStudentAnswer(e.target.value);
                    baseAnswerRef.current = e.target.value;
                  }}
                />

                <div className="response-actions-row">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !studentAnswer.trim()}
                  >
                    <Send size={15} /> {evaluating ? 'AI Evaluating Answer...' : 'Submit & Next Question'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* FINAL INTERVIEW REPORT */
            <div className="glass-card interview-final-report-card">
              <div className="report-header">
                <Award size={36} className="text-primary" />
                <div>
                  <h2 className="report-title">Mock Interview Evaluation Report</h2>
                  <p className="report-subtitle">Session finalized for {activeInterview.targetRole}</p>
                </div>

                <div className="final-overall-score-badge">
                  <span className="final-score-num">{activeInterview.finalEvaluation?.overallScore || '7.8'}</span>
                  <span className="final-score-denom">/ 10</span>
                </div>
              </div>

              {/* Category Scores Breakdown */}
              <div className="grid-3 report-metrics-grid">
                <div className="report-metric-box">
                  <span className="metric-lbl">Technical Knowledge</span>
                  <span className="metric-val">{activeInterview.finalEvaluation?.technicalKnowledgeScore || '8.0'} / 10</span>
                </div>
                <div className="report-metric-box">
                  <span className="metric-lbl">Communication & Clarity</span>
                  <span className="metric-val">{activeInterview.finalEvaluation?.communicationScore || '7.5'} / 10</span>
                </div>
                <div className="report-metric-box">
                  <span className="metric-lbl">Problem Solving Logic</span>
                  <span className="metric-val">{activeInterview.finalEvaluation?.problemSolvingScore || '8.0'} / 10</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid-2 report-feedback-grid">
                <div className="report-feedback-col strong-col">
                  <h4>🟢 Observed Strengths:</h4>
                  <ul>
                    {activeInterview.finalEvaluation?.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="report-feedback-col weak-col">
                  <h4>🟡 Areas for Improvement:</h4>
                  <ul>
                    {activeInterview.finalEvaluation?.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Executive Summary & Topics to Learn */}
              <div className="report-summary-box">
                <h4>Executive Placement Recommendation:</h4>
                <p>{activeInterview.finalEvaluation?.executiveSummary}</p>
                <div className="recommended-topics-row">
                  <span>Recommended Topics to Review: </span>
                  <div className="tags-cloud">
                    {activeInterview.finalEvaluation?.recommendedTopics?.map((t, i) => (
                      <span key={i} className="tag-item badge-purple">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setActiveInterview(null)} className="btn btn-primary btn-sm">
                Return to Interview Hub
              </button>
            </div>
          )}
        </div>
      ) : (
        /* INTERVIEW LAUNCHER & HISTORY VIEW */
        <>
          <div className="glass-card start-interview-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Launch Interactive AI Mock Interview</h3>
                <p className="card-subtitle">Select role and interview format to generate dynamic, project-aware questions</p>
              </div>
              <Mic size={24} className="text-primary" />
            </div>

            <div className="interview-config-row">
              <div className="config-group">
                <label>Target Role</label>
                <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>

              <div className="config-group">
                <label>Interview Format</label>
                <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                  <option value="Mixed">Mixed (Technical + Behavioral)</option>
                  <option value="Technical">Technical Deep-Dive</option>
                  <option value="HR">HR & Cultural Fit</option>
                </select>
              </div>

              <button
                onClick={handleStartInterview}
                className="btn btn-primary start-interview-btn"
                disabled={starting}
              >
                <Play size={16} /> {starting ? 'Generating AI Questions...' : 'Enter Interview Room'}
              </button>
            </div>
          </div>

          {/* Past Interview History */}
          <div className="glass-card history-card">
            <h3 className="card-title">Mock Interview History</h3>
            <p className="card-subtitle">Past interview score trajectories and evaluator remarks</p>

            {history.length === 0 ? (
              <div className="empty-state">
                <Mic size={40} className="empty-state-icon" />
                <div className="empty-state-title">No mock interviews recorded</div>
                <p className="empty-state-desc">Click 'Enter Interview Room' above to begin your first 5-question interview!</p>
              </div>
            ) : (
              <div className="history-table-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Target Role</th>
                      <th>Format</th>
                      <th>Questions</th>
                      <th>Overall Rating</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id}>
                        <td className="font-bold">{item.targetRole}</td>
                        <td><span className="badge badge-purple">{item.interviewType}</span></td>
                        <td>{item.questions?.length || 5} Questions</td>
                        <td>
                          <span className="badge badge-green font-bold">
                            {item.finalEvaluation?.overallScore ? `${item.finalEvaluation.overallScore} / 10` : 'In Progress'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${item.status === 'Completed' ? 'badge-teal' : 'badge-amber'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-muted">
                          {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
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

export default InterviewPage;
