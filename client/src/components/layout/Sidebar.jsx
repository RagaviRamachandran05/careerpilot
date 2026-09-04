import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Target,
  GitCompare,
  Map,
  Code2,
  Timer,
  Mic,
  Briefcase,
  TrendingUp,
  Settings,
  ShieldAlert,
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  const studentNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/resume', label: 'Resume Analyzer', icon: FileText, badge: 'AI ATS' },
    { to: '/career-goal', label: 'Career Goal', icon: Target },
    { to: '/skill-gap', label: 'Skill Gap', icon: GitCompare },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Map },
    { to: '/coding', label: 'Coding Practice', icon: Code2 },
    { to: '/assessments', label: 'Assessments', icon: Timer },
    { to: '/interview', label: 'AI Mock Interview', icon: Mic, badge: 'Voice/AI' },
    { to: '/jobs', label: 'Job Matches', icon: Briefcase },
    { to: '/progress', label: 'Progress Tracking', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      )}

      <aside className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <Sparkles size={20} className="logo-sparkle" />
          </div>
          <div className="brand-info">
            <span className="brand-title">CareerPilot <span className="gradient-text">AI</span></span>
            <span className="brand-subtitle">Placement Platform</span>
          </div>
        </div>

        {/* User Mini Card */}
        {user && (
          <div className="sidebar-user-card">
            <div className="user-avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role-tag">
                {isAdmin ? 'Placement Admin' : (user.careerPreferences?.targetRole || 'Student')}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="sidebar-scroll-area">
          <nav className="sidebar-nav">
            <span className="nav-group-label">STUDENT WORKSPACE</span>
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileSidebar}
                >
                  <div className="link-icon-wrap">
                    <Icon size={18} />
                  </div>
                  <span className="link-text">{item.label}</span>
                  {item.badge && <span className="link-badge">{item.badge}</span>}
                </NavLink>
              );
            })}

            {/* Admin Section if Admin */}
            {isAdmin && (
              <>
                <span className="nav-group-label admin-group">ADMINISTRATION</span>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `sidebar-link admin-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileSidebar}
                >
                  <div className="link-icon-wrap admin-icon">
                    <ShieldAlert size={18} />
                  </div>
                  <span className="link-text">Admin Portal</span>
                  <span className="link-badge admin-badge">Control</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {user && !isAdmin && (
            <div className="sidebar-readiness-widget">
              <div className="widget-header">
                <span>Career Readiness</span>
                <span className="widget-score">{user.readinessScore?.overall || 76}%</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${user.readinessScore?.overall || 76}%` }}
                />
              </div>
            </div>
          )}

          <button onClick={logout} className="sidebar-logout-btn" title="Sign out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
