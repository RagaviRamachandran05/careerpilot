import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ChevronLeft
} from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, demoStudentLogin, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password form state
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCollege, setRegCollege] = useState('Indian Institute of Information Technology');
  const [regDegree, setRegDegree] = useState('B.Tech');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regYear, setRegYear] = useState('2026');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please re-enter.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail,
        newPassword
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Password successfully updated! You can now sign in.');
        setLoginEmail(resetEmail);
        setIsForgotView(false);
        setActiveTab('login');
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your registered email.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        college: regCollege,
        degree: regDegree,
        department: regDept,
        graduationYear: regYear,
        role: 'student'
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await demoStudentLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login error. Starting demo mode...');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <Link to="/" className="auth-brand-logo">
            <div className="brand-logo">
              <Sparkles size={22} />
            </div>
            <span className="brand-title">CareerPilot <span className="gradient-text">AI</span></span>
          </Link>
          <p className="auth-subtitle">AI-Powered Placement & Career Development Platform</p>
        </div>

        {/* Tab Toggle (Hidden during Forgot Password view) */}
        {!isForgotView ? (
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
            >
              Create Student Account
            </button>
          </div>
        ) : (
          <div className="forgot-header-bar">
            <button
              type="button"
              className="forgot-back-btn"
              onClick={() => { setIsForgotView(false); setError(''); }}
            >
              <ChevronLeft size={16} /> Back to Sign In
            </button>
            <h3 className="forgot-title">Reset Account Password</h3>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="auth-success-alert">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {isForgotView ? (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <p className="forgot-instruction">
              Enter your registered student email address. We will verify your account and immediately update your password.
            </p>

            <div className="form-group">
              <label><Mail size={15} /> Registered Email Address</label>
              <input
                type="email"
                required
                placeholder="your.email@college.edu"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><Lock size={15} /> New Password (Min. 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><KeyRound size={15} /> Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Verifying & Updating...' : 'Verify Email & Reset Password'} <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <>
            {/* Login Form */}
            {activeTab === 'login' && (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label><Mail size={15} /> Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu or demo email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div className="password-label-row">
                    <label><Lock size={15} /> Password</label>
                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={() => {
                        setIsForgotView(true);
                        setResetEmail(loginEmail);
                        setError('');
                        setSuccessMsg('');
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Sign In to Workspace'} <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label><User size={15} /> Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label><Mail size={15} /> Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav.sharma@college.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label><Lock size={15} /> Password (Min. 6 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label><Building size={15} /> College / University</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NIT Trichy / IIIT"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label><GraduationCap size={15} /> Degree</label>
                    <select value={regDegree} onChange={(e) => setRegDegree(e.target.value)}>
                      <option value="B.Tech">B.Tech</option>
                      <option value="B.E.">B.E.</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="B.Sc CS">B.Sc Computer Science</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Department / Branch</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label><Calendar size={15} /> Graduation Year</label>
                    <select value={regYear} onChange={(e) => setRegYear(e.target.value)}>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* 1-Click Fast Student Demo Login */}
            <div className="auth-demo-divider">
              <span>OR EXPLORE INSTANTLY</span>
            </div>

            <div className="demo-login-box">
              <p className="demo-box-hint">1-Click Demonstration Student Account (Pre-configured with rich data):</p>
              <div className="demo-btn-group">
                <button type="button" onClick={handleDemoStudent} className="demo-btn student-demo-btn" disabled={loading}>
                  <Sparkles size={16} />
                  <span>Login as Demo Student</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
