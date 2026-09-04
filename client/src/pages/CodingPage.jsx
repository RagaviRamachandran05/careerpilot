import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Code2,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  Search,
  Filter,
  Lightbulb,
  Clock,
  Zap,
  HelpCircle,
  Check,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import './CodingPage.css';

const CodingPage = () => {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 12, solved: 0, attempted: 0 });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [language, setLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  const categories = [
    'All',
    'Arrays',
    'Strings',
    'HashMap',
    'Searching',
    'Sorting',
    'Recursion',
    'Stack',
    'Queue',
    'Linked List',
    'Trees',
    'Graphs',
    'Dynamic Programming'
  ];

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/coding/questions', {
        params: {
          category: selectedCategory,
          difficulty: selectedDifficulty,
          search: searchQuery
        }
      });
      if (res.data.success) {
        const fetchedList = res.data.questions || [];
        setQuestions(fetchedList);
        setStats(res.data.stats || { total: fetchedList.length, solved: 0, attempted: 0 });

        if (fetchedList.length > 0) {
          if (!selectedQuestion || !fetchedList.some(q => q._id === selectedQuestion._id)) {
            handleSelectQuestion(fetchedList[0]);
          }
        } else {
          setSelectedQuestion(null);
          setUserCode('');
        }
      }
    } catch (err) {
      console.warn('Failed to load coding questions:', err.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    setSubmissionResult(null);
    setShowHints(false);
    setShowAnswer(false);
    setUserCode(q.starterCode?.[language] || `// Write your ${language} solution here\n`);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (selectedQuestion) {
      setUserCode(selectedQuestion.starterCode?.[newLang] || `// Write your ${newLang} solution here\n`);
    }
  };

  const handleResetCode = () => {
    if (!selectedQuestion) return;
    const starter = selectedQuestion.starterCode?.[language] || `// Write your ${language} solution here\n`;
    setUserCode(starter);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  const handleLoadSolution = () => {
    if (!selectedQuestion) return;
    const solution = selectedQuestion.solutionCode?.[language];
    if (solution) {
      setUserCode(solution);
    }
  };

  const handleCopySolution = () => {
    if (!selectedQuestion) return;
    const solution = selectedQuestion.solutionCode?.[language];
    if (solution) {
      navigator.clipboard.writeText(solution);
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedQuestion || !userCode.trim()) return;
    setSubmitting(true);
    setSubmissionResult(null);

    try {
      const res = await api.post(`/coding/questions/${selectedQuestion._id}/submit`, {
        code: userCode,
        language
      });
      if (res.data.success) {
        setSubmissionResult(res.data.attempt);
        if (res.data.attempt.status === 'Passed') {
          confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
        }
        await fetchQuestions();
        await refreshUser();
      }
    } catch (err) {
      console.warn('Submission error:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="coding-page">
      {/* Top Banner Stats */}
      <div className="coding-stats-banner glass-card">
        <div className="coding-banner-left">
          <h1 className="page-title">Algorithmic Coding & AI Mentor</h1>
          <p className="page-subtitle">
            Practice across 12 standard Data Structures & Algorithms categories with clean starter templates and real-time Big-O feedback.
          </p>
        </div>

        <div className="coding-banner-stats">
          <div className="stat-pill">
            <span className="pill-num">{stats.solved} / {stats.total}</span>
            <span className="pill-lbl">Solved</span>
          </div>
          <div className="stat-pill">
            <span className="pill-num">{user?.readinessScore?.coding || 72}%</span>
            <span className="pill-lbl">Coding Readiness</span>
          </div>
        </div>
      </div>

      {/* Main Coding Workspace Layout: Split Left Problem / Right Code Editor */}
      <div className="coding-workspace-grid">
        {/* LEFT COLUMN: Problem List & Problem Description */}
        <div className="coding-left-panel">
          {/* Filters Bar */}
          <div className="glass-card coding-filter-card">
            <div className="search-row">
              <Search size={15} className="text-muted" />
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="categories-scroll-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="difficulty-row">
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  className={`diff-btn ${selectedDifficulty === diff ? 'active' : ''} ${diff.toLowerCase()}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Mini List */}
          <div className="questions-mini-list">
            {questions.length === 0 ? (
              <div className="empty-questions-box">
                <p>No questions match "{selectedCategory}" ({selectedDifficulty}).</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedDifficulty('All'); setSearchQuery(''); }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '0.5rem' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              questions.map((q) => {
                const isSelected = selectedQuestion?._id === q._id;
                const isSolved = q.userStatus === 'Solved';

                return (
                  <div
                    key={q._id}
                    className={`question-mini-item glass-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectQuestion(q)}
                  >
                    <div className="mini-item-left">
                      {isSolved ? (
                        <CheckCircle2 size={16} className="text-emerald" />
                      ) : (
                        <div className="unsolved-circle" />
                      )}
                      <span className="mini-item-title">{q.title}</span>
                    </div>

                    <div className="mini-item-right">
                      <span className={`badge badge-diff-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                      <span className="badge badge-purple">{q.category}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Problem Detailed Description */}
          {selectedQuestion ? (
            <div className="glass-card problem-details-card">
              <div className="prob-header">
                <div>
                  <h2 className="prob-title">{selectedQuestion.title}</h2>
                  <div className="prob-meta-tags">
                    <span className={`badge badge-diff-${selectedQuestion.difficulty.toLowerCase()}`}>
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="badge badge-teal">{selectedQuestion.category}</span>
                    <span className="badge badge-purple">Expected: {selectedQuestion.timeComplexityExpected}</span>
                  </div>
                </div>
              </div>

              <div className="prob-body">
                <div className="prob-desc">{selectedQuestion.description}</div>

                {selectedQuestion.examples?.map((ex, idx) => (
                  <div key={idx} className="example-box">
                    <span className="ex-title">Example {idx + 1}:</span>
                    <div className="ex-content">
                      <div><strong>Input:</strong> <code>{ex.input}</code></div>
                      <div><strong>Output:</strong> <code>{ex.output}</code></div>
                      {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
                    </div>
                  </div>
                ))}

                {selectedQuestion.constraints?.length > 0 && (
                  <div className="constraints-box">
                    <span className="constraints-title">Constraints:</span>
                    <ul>
                      {selectedQuestion.constraints.map((c, i) => (
                        <li key={i}><code>{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints Toggle */}
                {selectedQuestion.hints?.length > 0 && (
                  <div className="hints-section">
                    <button
                      className="hints-toggle-btn"
                      onClick={() => setShowHints(!showHints)}
                    >
                      <Lightbulb size={14} />
                      <span>{showHints ? 'Hide Hints' : 'View Algorithmic Hints'}</span>
                    </button>
                    {showHints && (
                      <div className="hints-box">
                        {selectedQuestion.hints.map((h, i) => (
                          <p key={i}>💡 {h}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Show Answer / Model Solution Section */}
                <div className="solution-reveal-section">
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
                        <span className="badge badge-teal">Model Solution ({language.toUpperCase()})</span>
                        <div className="solution-card-actions">
                          <button
                            className="btn btn-outline btn-xs"
                            onClick={handleCopySolution}
                          >
                            {copiedSolution ? <Check size={12} /> : <Copy size={12} />}
                            {copiedSolution ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={handleLoadSolution}
                          >
                            Load into Editor
                          </button>
                        </div>
                      </div>

                      {selectedQuestion.solutionExplanation && (
                        <p className="solution-explanation-text">
                          <strong>💡 Approach:</strong> {selectedQuestion.solutionExplanation}
                        </p>
                      )}

                      <pre className="solution-code-block">
                        <code>{selectedQuestion.solutionCode?.[language] || '// Solution not available for this language'}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card no-prob-selected">
              <BookOpen size={32} className="text-muted" />
              <p>Select a problem above to view constraints and start coding.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor Workspace & AI Evaluation */}
        <div className="coding-right-panel">
          <div className="glass-card editor-card">
            {/* Editor Toolbar */}
            <div className="editor-toolbar">
              <div className="lang-select-group">
                {[
                  { id: 'javascript', label: 'JAVASCRIPT' },
                  { id: 'python', label: 'PYTHON' },
                  { id: 'java', label: 'JAVA' },
                  { id: 'cpp', label: 'C++' }
                ].map((l) => (
                  <button
                    key={l.id}
                    className={`lang-btn ${language === l.id ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(l.id)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="editor-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleResetCode}
                  title="Reset code to clean starter boilerplate template"
                >
                  <RotateCcw size={14} /> Reset
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmitCode}
                  disabled={submitting || !selectedQuestion}
                >
                  <Play size={14} /> {submitting ? 'Running...' : 'Run & Submit Solution'}
                </button>
              </div>
            </div>

            {resetToast && (
              <div className="editor-reset-toast">
                <Check size={14} /> Code reset to clean starter template!
              </div>
            )}

            {/* Code Textarea Workspace */}
            <div className="code-textarea-wrap">
              <textarea
                className="code-textarea"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck="false"
                rows="18"
                placeholder="// Write your solution here..."
              />
            </div>
          </div>

          {/* AI Code Evaluation Feedback Box */}
          {submissionResult && (
            <div className={`glass-card ai-evaluation-card ${submissionResult.status === 'Passed' ? 'passed' : 'failed'}`}>
              <div className="eval-header-row">
                <div className="eval-status-row">
                  {submissionResult.status === 'Passed' ? (
                    <CheckCircle2 size={20} className="text-emerald" />
                  ) : (
                    <XCircle size={20} className="text-rose" />
                  )}
                  <h3 className="eval-heading">
                    {submissionResult.status === 'Passed' ? 'Solution Accepted!' : 'Submission Needs Improvement'}
                  </h3>
                </div>

                <div className="eval-badges">
                  <span className="badge badge-teal">Runtime: {submissionResult.runtimeMs}ms</span>
                  <span className="badge badge-purple">
                    Test Cases: {submissionResult.testCasesPassed} / {submissionResult.totalTestCases}
                  </span>
                </div>
              </div>

              {/* AI Deep Insights */}
              <div className="ai-feedback-body">
                <div className="complexity-grid">
                  <div className="complexity-pill">
                    <span className="comp-lbl">Time Complexity:</span>
                    <span className="comp-val">{submissionResult.aiFeedback?.timeComplexity || 'O(N)'}</span>
                  </div>
                  <div className="complexity-pill">
                    <span className="comp-lbl">Space Complexity:</span>
                    <span className="comp-val">{submissionResult.aiFeedback?.spaceComplexity || 'O(1)'}</span>
                  </div>
                </div>

                {submissionResult.aiFeedback?.summary && (
                  <p className="eval-summary-text">{submissionResult.aiFeedback.summary}</p>
                )}

                {submissionResult.aiFeedback?.betterApproach && (
                  <div className="optimal-approach-box">
                    <span className="optimal-title">💡 Pedagogical Insights & Better Approach:</span>
                    <p className="optimal-desc">{submissionResult.aiFeedback.betterApproach}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingPage;
