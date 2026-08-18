import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { jobsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import styles from './PostJobPage.module.css';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const CATEGORIES = ['Engineering', 'Design', 'Product', 'Data & AI', 'Marketing', 'Healthcare', 'Finance', 'Operations'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director', 'Any'];

const PostJobPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: 'Full-time',
    experience: 'Any',
    location: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'INR',
    description: '',
    requirements: '', // text area, split by newlines later
    responsibilities: '', // text area
    skills: '', // comma separated
    perks: '' // comma separated
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim() !== ''),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        perks: formData.perks.split(',').map(s => s.trim()).filter(s => s !== ''),
      };
      
      const { data } = await jobsAPI.create(payload);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div className={styles.formContainer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Post a <em>New Role</em></h1>
            <p className={styles.subtitle}>Find the perfect addition to your team.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basics */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>The Basics</h3>
              <div className={styles.grid2}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" name="title" className="form-input" required value={formData.title} onChange={handleChange} placeholder="e.g. Senior Product Designer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-input form-select" required value={formData.category} onChange={handleChange}>
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select name="type" className="form-input form-select" required value={formData.type} onChange={handleChange}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <select name="experience" className="form-input form-select" required value={formData.experience} onChange={handleChange}>
                    {EXP_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Location & Comp */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Location & Compensation</h3>
              <div className={styles.grid2}>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" name="location" className="form-input" required value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore, India" />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" name="isRemote" checked={formData.isRemote} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: 500 }}>This is a remote position</span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">Minimum Salary / yr</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.currencyAddon}>₹</span>
                    <input type="number" name="salaryMin" className="form-input" style={{ paddingLeft: '2.5rem' }} value={formData.salaryMin} onChange={handleChange} placeholder="1200000" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum Salary / yr</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.currencyAddon}>₹</span>
                    <input type="number" name="salaryMax" className="form-input" style={{ paddingLeft: '2.5rem' }} value={formData.salaryMax} onChange={handleChange} placeholder="1800000" />
                  </div>
                </div>
              </div>
            </section>

            {/* Details */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Role Details</h3>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-input" rows={5} required value={formData.description} onChange={handleChange} placeholder="Overview of the role..." />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Responsibilities (one per line)</label>
                <textarea name="responsibilities" className="form-input" rows={4} value={formData.responsibilities} onChange={handleChange} placeholder="What will they do day-to-day?" />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Requirements (one per line)</label>
                <textarea name="requirements" className="form-input" rows={4} value={formData.requirements} onChange={handleChange} placeholder="What qualifications are needed?" />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Skills (comma separated)</label>
                <input type="text" name="skills" className="form-input" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Figma, Marketing..." />
              </div>
              <div className="form-group">
                <label className="form-label">Perks & Benefits (comma separated)</label>
                <input type="text" name="perks" className="form-input" value={formData.perks} onChange={handleChange} placeholder="Health Insurance, Remote work, Learning budget..." />
              </div>
            </section>

            <div className={styles.formFooter}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? 'Posting...' : <><Send size={18} /> Post Job Listing</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostJobPage;
