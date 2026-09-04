import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Settings,
  Lock,
  User,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const [notifJobAlerts, setNotifJobAlerts] = useState(true);
  const [notifRoadmapReminders, setNotifRoadmapReminders] = useState(true);
  const [notifAssessmentAlerts, setNotifAssessmentAlerts] = useState(true);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPassLoading(true);
    setPassMsg({ type: '', text: '' });

    try {
      const res = await api.put('/auth/update-password', { currentPassword, newPassword });
      if (res.data.success) {
        setPassMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Account & Platform Settings</h1>
          <p className="page-subtitle">
            Manage your account security, interface theme, and notification preferences.
          </p>
        </div>
      </div>

      <div className="grid-2 settings-grid">
        {/* Security & Password */}
        <div className="glass-card settings-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Change Password</h3>
              <p className="card-subtitle">Ensure your account is protected with a strong password</p>
            </div>
            <Lock size={20} className="text-primary" />
          </div>

          {passMsg.text && (
            <div className={`settings-alert ${passMsg.type}`}>
              {passMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="settings-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label>New Password (Min. 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm" disabled={passLoading}>
              <Save size={14} /> {passLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Preferences & Display */}
        <div className="glass-card settings-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Preferences & Appearance</h3>
              <p className="card-subtitle">Personalize your CareerPilot experience</p>
            </div>
            <Settings size={20} className="text-teal" />
          </div>

          <div className="preferences-list">
            <div className="pref-item">
              <div>
                <span className="pref-title">Theme Appearance</span>
                <p className="pref-desc">Switch between modern Dark and clean Light mode.</p>
              </div>
              <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <div className="pref-item">
              <div>
                <span className="pref-title">Job Placement Alerts</span>
                <p className="pref-desc">Receive notifications when jobs with &gt;80% match are posted.</p>
              </div>
              <input
                type="checkbox"
                checked={notifJobAlerts}
                onChange={(e) => setNotifJobAlerts(e.target.checked)}
                className="pref-toggle"
              />
            </div>

            <div className="pref-item">
              <div>
                <span className="pref-title">Learning Roadmap Reminders</span>
                <p className="pref-desc">Weekly milestones reminder for in-progress study topics.</p>
              </div>
              <input
                type="checkbox"
                checked={notifRoadmapReminders}
                onChange={(e) => setNotifRoadmapReminders(e.target.checked)}
                className="pref-toggle"
              />
            </div>
          </div>

          <div className="settings-session-box">
            <span className="session-title">Account Session</span>
            <p className="session-desc">Logged in as: <strong>{user?.email}</strong> ({user?.role})</p>
            <button onClick={logout} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }}>
              <LogOut size={14} /> Sign Out of All Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
