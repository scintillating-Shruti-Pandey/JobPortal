import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Sparkles, ArrowRight, ChevronRight, Users, Briefcase, TrendingUp, Building2, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import CountUpLib from 'react-countup';
const CountUp = CountUpLib.default || CountUpLib;
import { jobsAPI } from '../../services/api';
import JobCard from '../../components/JobCard/JobCard';
import styles from './LandingPage.module.css';

const CATEGORIES = [
  { label: 'Engineering', icon: '⚙️', color: '#2D5016' },
  { label: 'Design', icon: '🎨', color: '#C8734B' },
  { label: 'Product', icon: '🚀', color: '#8FB86A' },
  { label: 'Data & AI', icon: '🧠', color: '#5B7FA6' },
  { label: 'Marketing', icon: '📣', color: '#B06A9A' },
  { label: 'Healthcare', icon: '💚', color: '#3D9970' },
  { label: 'Finance', icon: '💰', color: '#D4A017' },
  { label: 'Operations', icon: '📋', color: '#7F8C8D' },
];

const TESTIMONIALS = [
  { name: 'Ananya Krishnan', role: 'Senior Designer at Verdant Studio', text: 'NestWork felt like finding a job through a friend. The listings were curated and actually matched my vibe.', avatar: 'AK', rating: 5 },
  { name: 'Rohan Mehta', role: 'ML Engineer at Sylvan AI', text: 'I found my dream job in 2 weeks. The quality of companies here is completely different from other portals.', avatar: 'RM', rating: 5 },
  { name: 'Ishaan Chaudhary', role: 'Product Manager at Nexus', text: 'The UX alone made me trust the platform. Clean, thoughtful, and the jobs are genuinely interesting.', avatar: 'IC', rating: 5 },
];

const COMPANIES_TICKER = ['Luminary Labs', 'Verdant Studio', 'Nexus Dynamics', 'Aether Health', 'Sylvan AI', 'Prism Commerce', 'Aurora Tech', 'Cascade Systems', 'Delphi Works', 'Ember Labs'];

const StatItem = ({ value, label, suffix = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <div ref={ref} className={styles.statItem}>
      <div className={styles.statValue}>
        {inView ? <CountUp end={value} duration={2.2} separator="," suffix={suffix} /> : '0'}
      </div>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalApplications: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const blob3Y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([jobsAPI.getFeatured(), jobsAPI.getStats()]);
        setFeaturedJobs(jobsRes.data?.jobs || []);
        setStats(statsRes.data?.stats || { totalJobs: 0, totalCompanies: 0, totalApplications: 0 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className={styles.page}>

      {/* ===== HERO ===== */}
      <section className={styles.hero} ref={heroRef}>
        {/* Animated Blobs */}
        <motion.div className={`${styles.blob} ${styles.blob1}`} style={{ y: heroY }} />
        <motion.div className={`${styles.blob} ${styles.blob2}`} style={{ y: blob2Y }} />
        <motion.div className={`${styles.blob} ${styles.blob3}`} style={{ y: blob3Y }} />

        <motion.div className={styles.heroContent} style={{ opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.heroEyebrow}>
              <Sparkles size={14} />
              <span>Thoughtfully curated opportunities</span>
            </div>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            Find work that{' '}
            <span className={styles.heroTitleAccent}>feels like{' '}
              <span className={styles.underlineWiggle}>you.</span>
            </span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            NestWork connects curious minds with companies worth joining.<br />
            No noise. No spam. Just the right fit.
          </motion.p>

          {/* Search Form */}
          <motion.form
            className={styles.searchForm}
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.searchFields}>
              <div className={styles.searchField}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Job title, skills, or company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.searchDivider} />
              <div className={styles.searchField}>
                <MapPin size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="City or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
            <button type="submit" className={`btn btn-terra btn-lg ${styles.searchBtn}`}>
              Search Jobs <ArrowRight size={18} />
            </button>
          </motion.form>

          {/* Quick Links */}
          <motion.div
            className={styles.quickLinks}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className={styles.quickLabel}>Trending:</span>
            {['React Developer', 'Product Manager', 'UX Designer', 'Remote'].map((q) => (
              <button
                key={q}
                className={styles.quickChip}
                onClick={() => navigate(`/jobs?keyword=${q}`)}
              >
                {q}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Cards - decorative */}
        <motion.div
          className={styles.floatingCard1}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className={styles.fcLogo}>L</div>
          <div>
            <p className={styles.fcTitle}>Senior Engineer</p>
            <p className={styles.fcSub}>Luminary Labs · ₹36L</p>
          </div>
          <span className="badge badge-forest" style={{ fontSize: '0.7rem' }}>New</span>
        </motion.div>

        <motion.div
          className={styles.floatingCard2}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className={styles.fcAvatars}>
            {['A', 'B', 'C'].map((l, i) => (
              <div key={i} className={styles.fcAvatar} style={{ marginLeft: i > 0 ? '-8px' : 0 }}>{l}</div>
            ))}
          </div>
          <p className={styles.fcApplied}><strong>24 people</strong> applied today</p>
        </motion.div>
      </section>

      {/* ===== COMPANY TICKER ===== */}
      <div className={styles.ticker}>
        <div className={styles.tickerLabel}>Trusted by teams at</div>
        <div className={styles.tickerTrack}>
          <div className={styles.tickerInner}>
            {[...COMPANIES_TICKER, ...COMPANIES_TICKER].map((c, i) => (
              <span key={i} className={styles.tickerItem}>
                <Building2 size={14} /> {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <StatItem value={stats.totalJobs || 120} label="Active Openings" suffix="+" />
            <StatItem value={stats.totalCompanies || 45} label="Companies Hiring" suffix="+" />
            <StatItem value={stats.totalApplications || 800} label="Applications Sent" suffix="+" />
            <StatItem value={98} label="Placement Rate" suffix="%" />
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className={`${styles.categoriesSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-tag"><span>02</span> Explore by role</span>
            <h2 className={styles.sectionTitle}>What are you <em>great</em> at?</h2>
            <p className={styles.sectionSub}>Browse opportunities across disciplines. Your next chapter is one click away.</p>
          </div>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                className={styles.categoryCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => navigate(`/jobs?category=${cat.label}`)}
              >
                <div className={styles.categoryIcon} style={{ background: `${cat.color}18`, color: cat.color }}>
                  {cat.icon}
                </div>
                <span className={styles.categoryLabel}>{cat.label}</span>
                <ChevronRight size={14} className={styles.categoryArrow} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED JOBS ===== */}
      <section className={`${styles.featuredSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-tag"><span>03</span> Hand-picked</span>
            <h2 className={styles.sectionTitle}>Roles worth <em>getting excited</em> about</h2>
            <p className={styles.sectionSub}>Fresh listings from companies building things that matter.</p>
          </div>
          {loading ? (
            <div className={styles.jobsGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '24px' }} />
              ))}
            </div>
          ) : (
            <div className={styles.jobsGrid}>
              {featuredJobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))}
            </div>
          )}
          <div className={styles.viewAllWrap}>
            <Link to="/jobs" className="btn btn-outline btn-lg">
              View All Jobs <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={`${styles.howSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-tag"><span>04</span> Simple process</span>
            <h2 className={styles.sectionTitle}>From curious to <em>hired</em></h2>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', title: 'Create your profile', desc: 'Tell us who you are. Skills, experience, what you\'re looking for. Takes 3 minutes.', icon: '🌱' },
              { step: '02', title: 'Explore & discover', desc: 'Browse curated opportunities. Filter by role, location, salary. No junk — promise.', icon: '🔍' },
              { step: '03', title: 'Apply thoughtfully', desc: 'Send your application with a cover note. Quality over quantity, always.', icon: '✉️' },
              { step: '04', title: 'Land your role', desc: 'Get shortlisted, interview, negotiate, and start something new.', icon: '🎉' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className={styles.stepCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className={styles.stepNumber}>{s.step}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
                {i < 3 && <div className={styles.stepConnector} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`${styles.testimonialsSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="section-tag"><span>05</span> Stories</span>
            <h2 className={styles.sectionTitle}>People who found their <em>nest</em></h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className={styles.stars}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#C8734B" color="#C8734B" />)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <motion.div
            className={styles.ctaBanner}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.ctaBlob1} />
            <div className={styles.ctaBlob2} />
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to find your <em>next chapter?</em></h2>
              <p className={styles.ctaSubtitle}>Join thousands of professionals who found their dream roles through NestWork.</p>
              <div className={styles.ctaButtons}>
                <Link to="/auth?mode=register" className="btn btn-terra btn-lg">
                  Start for Free <ArrowRight size={18} />
                </Link>
                <Link to="/jobs" className={`btn btn-lg ${styles.ctaBtnOutline}`}>
                  Browse Jobs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link to="/" className={styles.footerLogo}>
                <Briefcase size={16} /> Nestwork
              </Link>
              <p className={styles.footerTagline}>Thoughtfully connecting talent with opportunity.</p>
            </div>
            <div className={styles.footerLinks}>
              <h4>Explore</h4>
              <Link to="/jobs">Browse Jobs</Link>
              <Link to="/companies">Companies</Link>
              <Link to="/auth?mode=register">Get Started</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>For Employers</h4>
              <Link to="/post-job">Post a Job</Link>
              <Link to="/employer/dashboard">Dashboard</Link>
            </div>
            <div className={styles.footerLinks}>
              <h4>Account</h4>
              <Link to="/auth">Sign In</Link>
              <Link to="/auth?mode=register">Register</Link>
              <Link to="/profile">My Profile</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2024 NestWork. Made with 🌿 in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
