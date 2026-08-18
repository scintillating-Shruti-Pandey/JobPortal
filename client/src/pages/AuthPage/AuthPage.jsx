import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Building2, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './AuthPage.module.css';

const GoogleIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.googleIcon}>
    <path fill="#4285F4" d="M21.35 11.1H12v2.95h5.35c-.23 1.45-1 2.67-2.18 3.49v2.9h3.53c2.07-1.91 3.27-4.72 3.27-8.08 0-.77-.07-1.51-.22-2.26z" />
    <path fill="#34A853" d="M12 22c2.97 0 5.46-.98 7.28-2.66l-3.53-2.9c-.98.66-2.23 1.05-3.75 1.05-2.88 0-5.32-1.94-6.19-4.55H2.18v2.98A10 10 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M5.81 13.94A5.98 5.98 0 0 1 5.5 12c0-.67.11-1.32.31-1.94V7.08H2.18A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.5l2.74-2.56z" />
    <path fill="#EA4335" d="M12 5.88c1.62 0 3.07.56 4.22 1.67l3.16-3.16C17.44 2.6 14.95 1.5 12 1.5A10 10 0 0 0 2.18 7.08l3.63 2.98C6.68 7.82 9.12 5.88 12 5.88z" />
  </svg>
);

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading, error, clearError } = useAuth();
  const isRegisterMode = searchParams.get('mode') === 'register';

  const [isLogin, setIsLogin] = useState(!isRegisterMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    companyName: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/jobs');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', role: 'seeker', companyName: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (isLogin) {
      res = await login({ email: formData.email, password: formData.password });
    } else {
      res = await register(formData);
    }
    if (res.success) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.authContainer}>
        {/* Left Side - Visual */}
        <div className={styles.visualSide}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          
          <div className={styles.visualContent}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <Briefcase size={20} />
              </div>
              <span className={styles.logoText}>Nest<span className={styles.logoAccent}>work</span></span>
            </Link>

            <motion.div 
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={styles.visualTextWrap}
            >
              <h2 className={styles.visualTitle}>
                {isLogin ? 'Welcome back to your next chapter.' : 'Join a community of thoughtful professionals.'}
              </h2>
              <p className={styles.visualSubtitle}>
                {isLogin 
                  ? 'Sign in to access your saved jobs, applications, and personalized recommendations.'
                  : 'Create an account to discover curated opportunities and build a career that feels right.'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>{isLogin ? 'Sign In' : 'Create Account'}</h1>
              <p className={styles.formSubtitle}>
                {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                <button type="button" onClick={toggleMode} className={styles.toggleLink}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <button type="button" className={styles.googleBtn} onClick={handleGoogleAuth}>
              <GoogleIcon />
              Continue with Google
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.roleToggle}>
                      <button 
                        type="button" 
                        className={`${styles.roleBtn} ${formData.role === 'seeker' ? styles.roleActive : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'seeker' })}
                      >
                        Job Seeker
                      </button>
                      <button 
                        type="button" 
                        className={`${styles.roleBtn} ${formData.role === 'employer' ? styles.roleActive : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'employer' })}
                      >
                        Employer
                      </button>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Full Name</label>
                      <div className={styles.inputWrap}>
                        <UserIcon size={18} className={styles.inputIcon} />
                        <input
                          type="text"
                          name="name"
                          className={`form-input ${styles.authInput}`}
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    {formData.role === 'employer' && (
                      <motion.div 
                        className="form-group" 
                        style={{ marginBottom: '1.25rem' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      >
                        <label className="form-label">Company Name</label>
                        <div className={styles.inputWrap}>
                          <Building2 size={18} className={styles.inputIcon} />
                          <input
                            type="text"
                            name="companyName"
                            className={`form-input ${styles.authInput}`}
                            placeholder="Acme Corp"
                            value={formData.companyName}
                            onChange={handleChange}
                            required={!isLogin && formData.role === 'employer'}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Email Address</label>
                <div className={styles.inputWrap}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${styles.authInput}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Password</label>
                <div className={styles.inputWrap}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type="password"
                    name="password"
                    className={`form-input ${styles.authInput}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
