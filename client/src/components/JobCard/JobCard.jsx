import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Bookmark, BookmarkCheck, TrendingUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './JobCard.module.css';

const formatSalary = (min, max, currency = 'INR') => {
  const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `${(n / 1000).toFixed(0)}K`;
  if (!min && !max) return null;
  const symbol = currency === 'INR' ? '₹' : '$';
  if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`;
  if (min) return `${symbol}${fmt(min)}+`;
  return `Up to ${symbol}${fmt(max)}`;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const typeColors = {
  'Full-time': 'badge-forest',
  'Part-time': 'badge-sage',
  'Contract': 'badge-terra',
  'Internship': 'badge-cream',
  'Freelance': 'badge-terra',
  'Remote': 'badge-forest',
};

const JobCard = ({ job, index = 0, compact = false }) => {
  const { isAuthenticated, user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Sign in to save jobs'); return; }
    if (user?.role !== 'seeker') return;
    setSaving(true);
    try {
      const { data } = await applicationsAPI.toggleSave(job._id);
      setSaved(data.saved);
      toast.success(data.message);
    } catch { toast.error('Failed to save job'); }
    setSaving(false);
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/jobs/${job._id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
        {/* Card glow accent */}
        <div className={styles.cardGlow} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.companyLogo}>
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} />
            ) : (
              <span>{job.company?.name?.[0] || 'C'}</span>
            )}
          </div>
          <div className={styles.headerInfo}>
            <p className={styles.companyName}>{job.company?.name}</p>
            {job.isRemote && <span className="badge badge-forest" style={{fontSize:'0.7rem', padding:'0.15rem 0.6rem'}}>🌍 Remote</span>}
          </div>
          {user?.role === 'seeker' && (
            <button className={`${styles.saveBtn} ${saved ? styles.saved : ''}`} onClick={handleSave} disabled={saving} aria-label="Save job">
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.title}>{job.title}</h3>

        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MapPin size={13} />
            {job.location}
          </span>
          <span className={styles.metaItem}>
            <Clock size={13} />
            {timeAgo(job.createdAt)}
          </span>
          {job.experience && job.experience !== 'Any' && (
            <span className={styles.metaItem}>
              <TrendingUp size={13} />
              {job.experience}
            </span>
          )}
        </div>

        {/* Skills */}
        {!compact && job.skills?.length > 0 && (
          <div className={styles.skills}>
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="badge badge-cream">{skill}</span>
            ))}
            {job.skills.length > 4 && (
              <span className="badge badge-cream">+{job.skills.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={`badge ${typeColors[job.type] || 'badge-cream'}`}>{job.type}</span>
            {salary && <span className={styles.salary}>{salary}</span>}
          </div>
          <span className={styles.viewBtn}>
            View <ExternalLink size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;
