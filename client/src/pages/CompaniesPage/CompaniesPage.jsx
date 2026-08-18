import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, ExternalLink } from 'lucide-react';
import styles from './CompaniesPage.module.css';

const MOCK_COMPANIES = [
  { id: 1, name: 'Luminary Labs', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=luminary', industry: 'Technology', size: '500-1000', location: 'Bangalore, India', openRoles: 12, description: 'We\'re building the next generation of developer tooling. Join our distributed team to architect scalable microservices and stunning user interfaces.' },
  { id: 2, name: 'Verdant Studio', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=verdant', industry: 'Design & Creative', size: '50-200', location: 'Mumbai, India', openRoles: 5, description: 'We need a storyteller who thinks in motion. You\'ll shape how the world sees Verdant — from logos to launch videos.' },
  { id: 3, name: 'Nexus Dynamics', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=nexus', industry: 'Finance', size: '1000-5000', location: 'Delhi NCR, India', openRoles: 24, description: 'Own the growth loop. You\'ll analyze data, run experiments, and work closely with engineering and design.' },
  { id: 4, name: 'Aether Health', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=aether', industry: 'Healthcare', size: '200-500', location: 'Pune, India', openRoles: 8, description: 'Navigate the complexity of healthcare product. You\'ll work with clinicians, regulators, and engineers to build products that genuinely improve patient outcomes.' },
  { id: 5, name: 'Sylvan AI', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=sylvan', industry: 'Artificial Intelligence', size: '100-500', location: 'Hyderabad, India', openRoles: 15, description: 'Build AI systems that genuinely help people. At Sylvan, we\'re creating ML pipelines for real-time health risk prediction.' },
  { id: 6, name: 'Prism Commerce', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=prism', industry: 'E-Commerce', size: '500-2000', location: 'Chennai, India', openRoles: 18, description: 'Transform raw data into stories that drive decisions. You\'ll own our BI stack, build dashboards that executives love.' },
];

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCompanies = MOCK_COMPANIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className={styles.pageTitle}>Discover <em>Companies</em></h1>
            <p className={styles.pageSubtitle}>Explore teams building the future and find your next work family.</p>
          </motion.div>

          <div className={styles.searchBar}>
            <div className={styles.searchInputWrap}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search by company name or industry..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.companiesGrid}>
          {filteredCompanies.map((company, index) => (
            <motion.div 
              key={company.id}
              className={styles.companyCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.logo}>
                  <img src={company.logo} alt={company.name} />
                </div>
                <div className={styles.headerInfo}>
                  <h3 className={styles.companyName}>{company.name}</h3>
                  <span className={`badge badge-cream ${styles.industryBadge}`}>{company.industry}</span>
                </div>
              </div>
              
              <p className={styles.description}>{company.description}</p>
              
              <div className={styles.metaInfo}>
                <span><MapPin size={14} /> {company.location}</span>
                <span><Building2 size={14} /> {company.size} employees</span>
              </div>
              
              <div className={styles.cardFooter}>
                <div className={styles.openRoles}>
                  <strong>{company.openRoles}</strong> open roles
                </div>
                <button className="btn btn-outline btn-sm">
                  View Profile <ExternalLink size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredCompanies.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>🏢</span>
            <h3>No companies found</h3>
            <p>Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
