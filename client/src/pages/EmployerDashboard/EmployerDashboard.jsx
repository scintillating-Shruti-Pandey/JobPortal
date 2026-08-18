import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import styles from './EmployerDashboard.module.css';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data } = await jobsAPI.getMyJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        toast.error('Failed to load your jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
  const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className={styles.title}>Employer <em>Workspace</em></h1>
              <p className={styles.subtitle}>{user?.companyName} • Manage your job listings</p>
            </motion.div>
            <Link to="/post-job" className="btn btn-primary">
              <PlusCircle size={18} /> Post New Job
            </Link>
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'var(--forest-mist)', color: 'var(--forest)' }}>
                <Briefcase size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{jobs.length}</span>
                <span className={styles.statLabel}>Active Jobs</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'var(--terra-pale)', color: 'var(--terra)' }}>
                <Users size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{totalApplicants}</span>
                <span className={styles.statLabel}>Total Applicants</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'rgba(91, 127, 166, 0.15)', color: '#5B7FA6' }}>
                <Eye size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{totalViews}</span>
                <span className={styles.statLabel}>Total Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className={styles.sectionTitle}>Your Listings</h2>
        {loading ? (
          <div className={styles.jobsList}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>🏢</span>
            <h3>No jobs posted yet</h3>
            <p>Ready to grow your team? Post your first job listing today.</p>
            <Link to="/post-job" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <PlusCircle size={18} /> Post a Job
            </Link>
          </div>
        ) : (
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <motion.div 
                key={job._id} 
                className={styles.jobRow}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.jobInfo}>
                  <h3 className={styles.jobTitle}>
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>
                  <div className={styles.jobMeta}>
                    <span className={`badge ${job.isActive ? 'badge-forest' : 'badge-cream'}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                    <span>{job.type} • {job.location}</span>
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className={styles.jobMetrics}>
                  <div className={styles.metric}>
                    <strong>{job.applicants?.length || 0}</strong> applicants
                  </div>
                  <div className={styles.metric}>
                    <strong>{job.views || 0}</strong> views
                  </div>
                </div>
                
                <div className={styles.jobActions}>
                  <Link to={`/jobs/${job._id}`} className="btn btn-ghost btn-sm" title="View"><Eye size={16} /></Link>
                  <button className="btn btn-ghost btn-sm" title="Edit"><Edit size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
