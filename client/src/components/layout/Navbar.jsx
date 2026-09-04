import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  User,
  Settings,
  LogOut,
  CheckCircle,
  ExternalLink,
  Target,
  Sparkles,
  Briefcase,
  BookOpen
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ toggleMobileSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search roadmaps, coding problems, jobs..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                navigate(`/coding?search=${encodeURIComponent(e.target.value)}`);
              }
            }}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Target Role Chip */}
        {user && !isAdmin && (
          <Link to="/career-goal" className="target-role-chip" title="Edit career goal">
            <Target size={14} className="target-icon" />
            <span className="chip-label">Goal:</span>
            <span className="chip-val">{user.careerPreferences?.targetRole || 'Full Stack Developer'}</span>
          </Link>
        )}

        {/* Theme Toggle */}
        <button
          className="nav-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="nav-dropdown-wrapper" ref={notifRef}>
          <button
            className="nav-icon-btn notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notif-dropdown-menu">
              <div className="dropdown-header">
                <div className="header-title-row">
                  <span className="header-title">Notifications</span>
                  {unreadCount > 0 && <span className="badge badge-purple">{unreadCount} new</span>}
                </div>
                {unreadCount > 0 && (
                  <button className="mark-all-read-btn" onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="empty-notif">
                    <CheckCircle size={28} className="empty-icon" />
                    <span>You're all caught up!</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                      onClick={() => {
                        markAsRead(n._id);
                        if (n.link) {
                          navigate(n.link);
                          setShowNotifications(false);
                        }
                      }}
                    >
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-message">{n.message}</div>
                        <div className="notif-time">
                          {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        {user && (
          <div className="nav-dropdown-wrapper" ref={userMenuRef}>
            <button
              className="user-profile-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="nav-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="nav-user-meta">
                <span className="meta-name">{user.name}</span>
                <span className="meta-sub">{isAdmin ? 'Admin' : 'Student'}</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="menu-user-header">
                  <span className="menu-user-name">{user.name}</span>
                  <span className="menu-user-email">{user.email}</span>
                </div>
                <div className="menu-divider" />
                <Link
                  to="/profile"
                  className="menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="menu-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="menu-item admin-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Briefcase size={16} />
                    <span>Admin Directorate</span>
                  </Link>
                )}
                <div className="menu-divider" />
                <button
                  className="menu-item logout-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
