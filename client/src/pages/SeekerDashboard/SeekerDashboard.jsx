import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Bookmark, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationsAPI } from '../../services/api';
import JobCard from '../../components/JobCard/JobCard';
import styles from './SeekerDashboard.module.css';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data } = await applicationsAPI.getMyApplications();
        setApplications(data.applications || []);
        
        // In a real app, we'd fetch saved jobs via an API endpoint. 
        // For now, we simulate fetching saved jobs using the user object if populated,
        // or just set it to empty array.
        setSavedJobs(user?.savedJobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={16} className={styles.statusPending} />;
      case 'reviewed': return <FileText size={16} className={styles.statusReviewed} />;
      case 'shortlisted': return <CheckCircle size={16} className={styles.statusShortlisted} />;
      case 'hired': return <CheckCircle size={16} className={styles.statusHired} />;
      case 'rejected': return <XCircle size={16} className={styles.statusRejected} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className={styles.title}>Hello, <em>{user?.name?.split(' ')[0]}</em></h1>
            <p className={styles.subtitle}>Welcome back to your career hub.</p>
          </motion.div>
          
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'var(--forest-mist)', color: 'var(--forest)' }}>
                <Briefcase size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{applications.length}</span>
                <span className={styles.statLabel}>Applications</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'var(--terra-pale)', color: 'var(--terra)' }}>
                <Bookmark size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{savedJobs.length}</span>
                <span className={styles.statLabel}>Saved Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'applications' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            My Applications
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'saved' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Jobs
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.grid}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '16px' }} />)}
            </div>
          ) : activeTab === 'applications' ? (
            <div className={styles.applicationsList}>
              {applications.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyEmoji}>📝</span>
                  <h3>No applications yet</h3>
                  <p>Time to start exploring and applying to your dream roles.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <motion.div 
                    key={app._id} 
                    className={styles.applicationCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.appHeader}>
                      <div>
                        <h3 className={styles.jobTitle}>{app.job?.title}</h3>
                        <p className={styles.companyName}>{app.job?.company?.name} • {app.job?.location}</p>
                      </div>
                      <div className={`${styles.statusBadge} ${styles[`status_${app.status}`]}`}>
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </div>
                    </div>
                    <div className={styles.appFooter}>
                      <span className={styles.appliedDate}>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className={styles.grid}>
              {savedJobs.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyEmoji}>🔖</span>
                  <h3>No saved jobs</h3>
                  <p>When you see a job you like, save it to review later.</p>
                </div>
              ) : (
                savedJobs.map((job) => (
                  <JobCard key={job._id || job} job={job} compact />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
