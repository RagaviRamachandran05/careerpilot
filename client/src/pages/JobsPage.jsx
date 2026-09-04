import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Filter,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import './JobsPage.css';

const JobsPage = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'saved'
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs', {
        params: { search, location, experienceLevel }
      });
      if (res.data.success) {
        setJobs(res.data.jobs);
        if (!selectedJob && res.data.jobs.length > 0) {
          setSelectedJob(res.data.jobs[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load jobs:', err.message);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/jobs/saved/all');
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs);
      }
    } catch (err) {
      console.warn('Failed to load saved jobs:', err.message);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchSavedJobs()]);
      setLoading(false);
    };
    loadAll();
  }, [search, location, experienceLevel]);

  const handleToggleSave = async (job) => {
    try {
      if (job.isSaved) {
        await api.delete(`/jobs/${job._id}/save`);
      } else {
        await api.post(`/jobs/${job._id}/save`, { status: 'Saved' });
      }
      await fetchJobs();
      await fetchSavedJobs();
      if (selectedJob?._id === job._id) {
        setSelectedJob({ ...selectedJob, isSaved: !job.isSaved });
      }
    } catch (err) {
      console.warn('Error saving job:', err.message);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.post(`/jobs/${jobId}/save`, { status: newStatus });
      await fetchJobs();
      await fetchSavedJobs();
    } catch (err) {
      console.warn('Error updating status:', err.message);
    }
  };

  return (
    <div className="jobs-page">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">AI Explainable Job Placement Matches</h1>
          <p className="page-subtitle">
            Curated on-campus and off-campus roles evaluated against your exact skill set and projects with transparent match breakdowns.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="jobs-tabs-bar">
        <button
          className={`jobs-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Briefcase size={16} /> All Matched Roles ({jobs.length})
        </button>
        <button
          className={`jobs-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <BookmarkCheck size={16} /> My Application Pipeline ({savedJobs.length})
        </button>
      </div>

      {/* TAB 1: All Matched Jobs */}
      {activeTab === 'all' && (
        <div className="jobs-split-layout">
          {/* Left Column: Filter & Job Cards List */}
          <div className="jobs-list-column">
            {/* Filters */}
            <div className="glass-card jobs-filter-card">
              <div className="search-row">
                <Search size={15} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search by title, skills, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-dropdowns-row">
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="All">All Locations</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Remote">Remote</option>
                </select>

                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                  <option value="All">All Experience</option>
                  <option value="Fresher">Fresher / Graduate</option>
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="jobs-cards-list">
              {jobs.length === 0 ? (
                <div className="empty-state">
                  <Briefcase size={40} className="empty-state-icon" />
                  <div className="empty-state-title">No matching jobs found</div>
                  <p className="empty-state-desc">Try loosening your search filters or adding more skills to your profile.</p>
                </div>
              ) : (
                jobs.map((job) => {
                  const isSelected = selectedJob?._id === job._id;
                  return (
                    <div
                      key={job._id}
                      className={`job-card-item glass-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="job-card-top">
                        <div>
                          <h3 className="job-title">{job.title}</h3>
                          <span className="job-company">{job.company}</span>
                        </div>
                        <span className="badge badge-teal font-bold">{job.matchScore}% Match</span>
                      </div>

                      <div className="job-meta-row">
                        <span className="meta-item"><MapPin size={13} /> {job.location}</span>
                        <span className="meta-item"><DollarSign size={13} /> {job.salary}</span>
                      </div>

                      <div className="job-skills-preview">
                        {(job.requiredSkills || []).slice(0, 4).map((s, idx) => (
                          <span key={idx} className="skill-mini-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Job Details with Explainability */}
          {selectedJob && (
            <div className="job-details-column">
              <div className="glass-card job-full-details-card">
                <div className="job-details-header">
                  <div>
                    <h2 className="job-full-title">{selectedJob.title}</h2>
                    <span className="job-full-company">{selectedJob.company} • {selectedJob.location} • {selectedJob.employmentType}</span>
                  </div>

                  <div className="job-cta-buttons">
                    <button
                      className={`btn ${selectedJob.isSaved ? 'btn-secondary' : 'btn-outline'} btn-sm`}
                      onClick={() => handleToggleSave(selectedJob)}
                    >
                      {selectedJob.isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      {selectedJob.isSaved ? 'Saved' : 'Save Job'}
                    </button>
                    <a
                      href={selectedJob.applicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusChange(selectedJob._id, 'Applied')}
                    >
                      Apply Now <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Explainable AI Matching Box */}
                <div className="ai-explainability-box glass-card">
                  <div className="explain-header">
                    <Sparkles size={18} className="text-primary" />
                    <h4>Why You're an {selectedJob.matchScore}% Match for this Role</h4>
                  </div>

                  <ul className="why-match-list">
                    {(selectedJob.whyMatchReasons || []).map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>

                  {/* Skills to Learn */}
                  {selectedJob.improvementSuggestions?.length > 0 && (
                    <div className="to-improve-box">
                      <span className="improve-lbl">Skills to Learn for a Higher Fit:</span>
                      <ul className="improve-list">
                        {selectedJob.improvementSuggestions.map((sugg, i) => (
                          <li key={i}>{sugg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Job Description & Responsibilities */}
                <div className="job-description-body">
                  <h4 className="body-heading">About the Opportunity</h4>
                  <p className="body-text">{selectedJob.description}</p>

                  {selectedJob.responsibilities?.length > 0 && (
                    <>
                      <h4 className="body-heading">Key Responsibilities</h4>
                      <ul className="responsibilities-list">
                        {selectedJob.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedJob.benefits?.length > 0 && (
                    <>
                      <h4 className="body-heading">Perks & Compensation</h4>
                      <ul className="benefits-list">
                        {selectedJob.benefits.map((b, i) => (
                          <li key={i}>🎁 {b}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Application Pipeline (Kanban / Saved Jobs) */}
      {activeTab === 'saved' && (
        <div className="pipeline-kanban-view">
          <div className="grid-4 kanban-grid">
            {['Saved', 'Applied', 'Interviewing', 'Offered'].map((status) => {
              const columnJobs = savedJobs.filter(sj => sj.status === status);
              return (
                <div key={status} className="glass-card kanban-column">
                  <div className="kanban-col-header">
                    <h4 className="col-title">{status}</h4>
                    <span className="badge badge-purple">{columnJobs.length}</span>
                  </div>

                  <div className="kanban-cards-stack">
                    {columnJobs.length === 0 ? (
                      <div className="kanban-empty">No applications in this stage</div>
                    ) : (
                      columnJobs.map((sj) => (
                        <div key={sj._id} className="kanban-card glass-card">
                          <h5 className="k-job-title">{sj.jobId?.title || 'Engineering Role'}</h5>
                          <span className="k-company">{sj.jobId?.company || 'Tech Company'}</span>

                          <div className="k-status-select-wrap">
                            <select
                              value={sj.status}
                              onChange={(e) => handleStatusChange(sj.jobId?._id, e.target.value)}
                              className="k-status-select"
                            >
                              <option value="Saved">Stage: Saved</option>
                              <option value="Applied">Stage: Applied</option>
                              <option value="Interviewing">Stage: Interviewing</option>
                              <option value="Offered">Stage: Offered</option>
                              <option value="Rejected">Stage: Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
