import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { jobsAPI } from '../../services/api';
import JobCard from '../../components/JobCard/JobCard';
import styles from './JobsPage.module.css';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];
const CATEGORIES = ['Engineering', 'Design', 'Product', 'Data & AI', 'Marketing', 'Healthcare', 'Finance', 'Operations'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'salary_high', label: 'Highest Salary' },
  { value: 'salary_low', label: 'Lowest Salary' },
];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
    isRemote: searchParams.get('isRemote') || '',
    sortBy: 'newest',
    page: 1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await jobsAPI.getAll(params);
      setJobs(data.jobs);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === prev[key] ? '' : value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ keyword: '', location: '', type: '', category: '', experience: '', isRemote: '', sortBy: 'newest', page: 1 });
  };

  const activeFilterCount = [filters.type, filters.category, filters.experience, filters.isRemote].filter(Boolean).length;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className={styles.pageTitle}>Browse <em>Opportunities</em></h1>
            <p className={styles.pageSubtitle}>{total > 0 ? `${total} thoughtfully selected roles` : 'Discovering roles for you...'}</p>
          </motion.div>

          {/* Search Bar */}
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <div className={styles.searchInputWrap}>
              <Search size={16} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Job title, skills, company..."
                value={filters.keyword}
                onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
              />
              {filters.keyword && (
                <button type="button" onClick={() => setFilters((p) => ({ ...p, keyword: '' }))}><X size={14} /></button>
              )}
            </div>
            <div className={styles.searchInputWrap}>
              <MapPin size={16} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="City or Remote"
                value={filters.location}
                onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            <button
              type="button"
              className={`btn btn-ghost ${styles.filterToggle}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && <span className={styles.filterBadge}>{activeFilterCount}</span>}
            </button>
          </form>

          {/* Sort + Active Filters */}
          <div className={styles.topBar}>
            <div className={styles.activeFilters}>
              {filters.type && <span className="badge badge-forest">{filters.type} <button onClick={() => updateFilter('type', filters.type)}><X size={10} /></button></span>}
              {filters.category && <span className="badge badge-terra">{filters.category} <button onClick={() => updateFilter('category', filters.category)}><X size={10} /></button></span>}
              {filters.experience && <span className="badge badge-sage">{filters.experience} <button onClick={() => updateFilter('experience', filters.experience)}><X size={10} /></button></span>}
              {filters.isRemote && <span className="badge badge-forest">Remote <button onClick={() => setFilters((p) => ({ ...p, isRemote: '' }))}><X size={10} /></button></span>}
              {activeFilterCount > 0 && <button className={styles.clearBtn} onClick={clearFilters}>Clear all</button>}
            </div>
            <select
              className={`form-input form-select ${styles.sortSelect}`}
              value={filters.sortBy}
              onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                className={styles.sidebar}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              >
                <div className={styles.sidebarSection}>
                  <h3 className={styles.sidebarTitle}>Job Type</h3>
                  <div className={styles.filterOptions}>
                    {JOB_TYPES.map((t) => (
                      <button
                        key={t}
                        className={`${styles.filterChip} ${filters.type === t ? styles.activeChip : ''}`}
                        onClick={() => updateFilter('type', t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <h3 className={styles.sidebarTitle}>Category</h3>
                  <div className={styles.filterOptions}>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        className={`${styles.filterChip} ${filters.category === c ? styles.activeChip : ''}`}
                        onClick={() => updateFilter('category', c)}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <h3 className={styles.sidebarTitle}>Experience</h3>
                  <div className={styles.filterOptions}>
                    {EXPERIENCE_LEVELS.map((e) => (
                      <button
                        key={e}
                        className={`${styles.filterChip} ${filters.experience === e ? styles.activeChip : ''}`}
                        onClick={() => updateFilter('experience', e)}
                      >{e}</button>
                    ))}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <h3 className={styles.sidebarTitle}>Work Mode</h3>
                  <button
                    className={`${styles.filterChip} ${filters.isRemote === 'true' ? styles.activeChip : ''}`}
                    onClick={() => setFilters((p) => ({ ...p, isRemote: p.isRemote === 'true' ? '' : 'true' }))}
                  >🌍 Remote Only</button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Job Grid */}
          <div className={styles.jobsArea}>
            {loading ? (
              <div className={styles.jobsGrid}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '24px' }} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className={styles.emptyEmoji}>🌿</span>
                <h3>No roles found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button className="btn btn-outline" onClick={clearFilters}>Reset Filters</button>
              </motion.div>
            ) : (
              <div className={styles.jobsGrid}>
                {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className={styles.pageInfo}>Page {filters.page} of {totalPages}</span>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={filters.page >= totalPages}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
