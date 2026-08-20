import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, ChevronDown, LogOut, LayoutDashboard, PlusCircle, Menu, X, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const dashboardPath = user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard';

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.leftSection}>
            {/* Logo */}
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <Briefcase size={18} />
              </div>
              <span className={styles.logoText}>
                Nest<span className={styles.logoAccent}>work</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className={styles.navLinks}>
              <NavLink to="/jobs" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                Browse Jobs
              </NavLink>
              <NavLink to="/companies" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                Companies
              </NavLink>
              {user?.role === 'employer' && (
                <NavLink to="/post-job" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                  Post a Job
                </NavLink>
              )}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className={styles.authSection}>
            {isAuthenticated ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button className={styles.userButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className={styles.avatar}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user?.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`${styles.chevron} ${dropdownOpen ? styles.rotated : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={styles.dropdownHeader}>
                        <p className={styles.dropdownName}>{user?.name}</p>
                        <p className={styles.dropdownRole}>{user?.role === 'employer' ? '🏢 Employer' : '🌱 Job Seeker'}</p>
                      </div>
                      <div className={styles.dropdownDivider} />
                      <Link to={dashboardPath} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      {user?.role === 'seeker' && (
                        <Link to="/seeker/saved" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                          <BookmarkCheck size={15} /> Saved Jobs
                        </Link>
                      )}
                      {user?.role === 'employer' && (
                        <Link to="/post-job" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                          <PlusCircle size={15} /> Post a Job
                        </Link>
                      )}
                      <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        <User size={15} /> My Profile
                      </Link>
                      <div className={styles.dropdownDivider} />
                      <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/auth" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/auth?mode=register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.mobileMenuInner}>
              <NavLink to="/jobs" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Browse Jobs</NavLink>
              <NavLink to="/companies" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Companies</NavLink>
              {user?.role === 'employer' && (
                <NavLink to="/post-job" className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Post a Job</NavLink>
              )}
              {isAuthenticated ? (
                <>
                  <NavLink to={dashboardPath} className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                  <button className={`${styles.mobileNavLink} ${styles.mobileLogout}`} onClick={handleLogout}>Sign Out</button>
                </>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Link to="/auth" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>Sign In</Link>
                  <Link to="/auth?mode=register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
