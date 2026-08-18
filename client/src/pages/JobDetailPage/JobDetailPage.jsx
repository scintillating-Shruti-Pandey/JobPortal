import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Briefcase, TrendingUp, Globe, Users, CheckCircle,
  ArrowLeft, Bookmark, BookmarkCheck, Send, X, Building2, DollarSign, Gift
} from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './JobDetailPage.module.css';

const formatSalary = (min, max, currency = 'INR') => {
  const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`;
  const symbol = currency === 'INR' ? '₹' : '$';
  if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)} / yr`;
  if (min) return `${symbol}${fmt(min)}+ / yr`;
  return null;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
};

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicationsAPI.apply(job._id, { coverLetter });
      toast.success('Application submitted! 🎉');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div className={styles.modal} initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
        <div className={styles.modalHeader}>
          <h2>Apply for <em>{job.title}</em></h2>
          <button onClick={onClose} className={styles.modalClose}><X size={20} /></button>
        </div>
        <div className={styles.modalCompany}>
          <div className={styles.modalLogo}>
            {job.company?.logo ? <img src={job.company.logo} alt="" /> : <span>{job.company?.name?.[0]}</span>}
          </div>
          <div>
            <p className={styles.modalCompanyName}>{job.company?.name}</p>
            <p className={styles.modalLocation}><MapPin size={13} /> {job.location}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className="form-group">
            <label className="form-label">Cover Letter <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>(optional but recommended)</span></label>
            <textarea
              className={`form-input ${styles.coverLetterArea}`}
              placeholder="Tell them why you're excited about this role and what makes you a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
            />
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Application</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await jobsAPI.getById(id);
        setJob(data.job);
      } catch { navigate('/jobs'); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Sign in to save jobs'); return; }
    if (user?.role !== 'seeker') return;
    try {
      const { data } = await applicationsAPI.toggleSave(id);
      setSaved(data.saved);
      toast.success(data.message);
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return (
    <div className={styles.loadingPage}>
      <div className="skeleton" style={{ height: '300px', borderRadius: '24px', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: '400px', borderRadius: '24px' }} />
    </div>
  );

  if (!job) return null;

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back */}
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>

        <div className={styles.layout}>
          {/* Main Content */}
          <motion.main className={styles.main} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            {/* Job Header */}
            <div className={styles.jobHeader}>
              <div className={styles.companyLogoLg}>
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} />
                ) : (
                  <span>{job.company?.name?.[0]}</span>
                )}
              </div>
              <div className={styles.jobHeaderInfo}>
                <div className={styles.jobMeta}>
                  <span className={`badge ${job.isRemote ? 'badge-forest' : 'badge-cream'}`}>
                    {job.isRemote ? '🌍 Remote' : '🏢 On-site'}
                  </span>
                  <span className="badge badge-terra">{job.type}</span>
                  <span className="badge badge-cream">{job.category}</span>
                </div>
                <h1 className={styles.jobTitle}>{job.title}</h1>
                <div className={styles.jobSubMeta}>
                  <span><Building2 size={14} /> {job.company?.name}</span>
                  <span><MapPin size={14} /> {job.location}</span>
                  <span><Clock size={14} /> Posted {timeAgo(job.createdAt)}</span>
                  {job.experience && job.experience !== 'Any' && (
                    <span><TrendingUp size={14} /> {job.experience}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Required Skills</h2>
                <div className={styles.skillsWrap}>
                  {job.skills.map((s) => <span key={s} className="badge badge-forest">{s}</span>)}
                </div>
              </div>
            )}

            {/* Description */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About This Role</h2>
              <p className={styles.description}>{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>What You'll Do</h2>
                <ul className={styles.bulletList}>
                  {job.responsibilities.map((r, i) => (
                    <li key={i}><CheckCircle size={15} className={styles.check} /><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>What We're Looking For</h2>
                <ul className={styles.bulletList}>
                  {job.requirements.map((r, i) => (
                    <li key={i}><CheckCircle size={15} className={styles.check} /><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {job.perks?.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Perks & Benefits</h2>
                <div className={styles.perksGrid}>
                  {job.perks.map((p) => (
                    <div key={p} className={styles.perkItem}>
                      <Gift size={15} className={styles.perkIcon} /> {p}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.main>

          {/* Sticky Sidebar */}
          <motion.aside className={styles.sidebar} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            {/* Apply Card */}
            <div className={styles.applyCard}>
              {salary && (
                <div className={styles.salaryDisplay}>
                  <span className={styles.salaryLabel}>Compensation</span>
                  <span className={styles.salaryValue}>{salary}</span>
                </div>
              )}

              {user?.role === 'seeker' || !isAuthenticated ? (
                <>
                  <button
                    className={`btn btn-primary btn-lg ${styles.applyBtn}`}
                    onClick={() => {
                      if (!isAuthenticated) { toast.error('Sign in to apply'); navigate('/auth'); return; }
                      if (applied) { toast('Already applied!'); return; }
                      setShowModal(true);
                    }}
                    disabled={applied}
                  >
                    {applied ? <><CheckCircle size={18} /> Applied!</> : <><Send size={18} /> Apply Now</>}
                  </button>
                  <button className={`btn btn-ghost ${styles.saveBtn}`} onClick={handleSave}>
                    {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save Job</>}
                  </button>
                </>
              ) : (
                <div className={styles.employerNote}>
                  <p>You're viewing this as an employer.</p>
                  <Link to="/employer/dashboard" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Go to Dashboard</Link>
                </div>
              )}

              <div className={styles.applyMeta}>
                <span><Users size={13} /> {job.applicants?.length || 0} applicants</span>
                {job.deadline && <span><Clock size={13} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
              </div>
            </div>

            {/* Company Card */}
            <div className={styles.companyCard}>
              <h3 className={styles.companyCardTitle}>About the Company</h3>
              <div className={styles.companyCardLogo}>
                {job.company?.logo ? <img src={job.company.logo} alt="" /> : <span>{job.company?.name?.[0]}</span>}
              </div>
              <h4 className={styles.companyCardName}>{job.company?.name}</h4>
              {job.company?.industry && <p className={styles.companyCardIndustry}>{job.company.industry}</p>}
              {job.company?.description && <p className={styles.companyCardDesc}>{job.company.description}</p>}
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" className={`btn btn-ghost btn-sm ${styles.companyLink}`}>
                  <Globe size={14} /> Visit Website
                </a>
              )}
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showModal && (
          <ApplyModal job={job} onClose={() => setShowModal(false)} onSuccess={() => setApplied(true)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetailPage;
