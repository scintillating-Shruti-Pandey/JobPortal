require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const companies = [
  { name: 'Luminary Labs', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=luminary', industry: 'Technology', size: '500-1000', website: 'https://luminarylabs.io' },
  { name: 'Verdant Studio', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=verdant', industry: 'Design & Creative', size: '50-200', website: 'https://verdantstudio.io' },
  { name: 'Nexus Dynamics', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=nexus', industry: 'Finance', size: '1000-5000', website: 'https://nexusdynamics.com' },
  { name: 'Aether Health', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=aether', industry: 'Healthcare', size: '200-500', website: 'https://aetherhealth.com' },
  { name: 'Sylvan AI', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=sylvan', industry: 'Artificial Intelligence', size: '100-500', website: 'https://sylvanai.tech' },
  { name: 'Prism Commerce', logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=prism', industry: 'E-Commerce', size: '500-2000', website: 'https://prismcommerce.io' },
];

const jobsData = [
  {
    title: 'Senior Full-Stack Engineer',
    description: 'We\'re building the next generation of developer tooling. Join our distributed team to architect scalable microservices and stunning user interfaces. You\'ll be owning features end-to-end, from database design to pixel-perfect UI delivery.',
    requirements: ['5+ years of full-stack experience', 'Proficiency in React and Node.js', 'Experience with cloud platforms (AWS/GCP)', 'Strong understanding of system design'],
    responsibilities: ['Architect and implement new product features', 'Conduct code reviews and mentor junior engineers', 'Collaborate with design and product teams', 'Optimize application performance'],
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'],
    type: 'Full-time', location: 'Bangalore, India', isRemote: true,
    salaryMin: 2400000, salaryMax: 3600000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Senior Level', category: 'Engineering', company: companies[0],
    perks: ['Remote-first', 'Unlimited PTO', 'Learning budget ₹1L/year', 'Health insurance'],
    tags: ['Remote', 'Startup', 'Equity'],
  },
  {
    title: 'Brand & Motion Designer',
    description: 'We need a storyteller who thinks in motion. You\'ll shape how the world sees Verdant — from logos to launch videos, social campaigns to design systems. Creative freedom + real impact.',
    requirements: ['4+ years in brand/motion design', 'Proficiency in Figma, After Effects', 'Strong portfolio demonstrating brand work', 'Experience with design systems'],
    responsibilities: ['Lead brand identity projects', 'Create motion graphics and animations', 'Maintain and evolve the design system', 'Collaborate with marketing and product'],
    skills: ['Figma', 'After Effects', 'Illustrator', 'Principle', 'Lottie', 'Photoshop'],
    type: 'Full-time', location: 'Mumbai, India', isRemote: false,
    salaryMin: 1500000, salaryMax: 2200000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Design', company: companies[1],
    perks: ['Creative studio space', 'Annual retreat', 'Tool budget', 'Flexible hours'],
    tags: ['Creative', 'Growth stage', 'In-office'],
  },
  {
    title: 'Product Manager — Growth',
    description: 'Own the growth loop. You\'ll analyze data, run experiments, and work closely with engineering and design to turn insights into shipped features that drive acquisition and retention.',
    requirements: ['3+ years in product management', 'Experience with growth metrics and A/B testing', 'Strong analytical skills', 'Excellent communication skills'],
    responsibilities: ['Define and drive the growth roadmap', 'Run A/B experiments and analyze results', 'Work with data science on user segmentation', 'Partner with marketing on go-to-market'],
    skills: ['Product Strategy', 'SQL', 'Mixpanel', 'A/B Testing', 'Figma', 'JIRA'],
    type: 'Full-time', location: 'Delhi NCR, India', isRemote: true,
    salaryMin: 2000000, salaryMax: 3000000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Product', company: companies[2],
    perks: ['Stock options', 'WFH stipend', 'Annual bonus', 'Top-tier health plan'],
    tags: ['Remote', 'Series B', 'Equity'],
  },
  {
    title: 'Machine Learning Engineer',
    description: 'Build AI systems that genuinely help people. At Sylvan, we\'re creating ML pipelines for real-time health risk prediction. You\'ll work on research to production — the full cycle.',
    requirements: ['MS/PhD in Computer Science or related field', '3+ years in ML engineering', 'Experience with PyTorch/TensorFlow', 'Knowledge of MLOps practices'],
    responsibilities: ['Design and train production ML models', 'Build ML pipelines with Airflow/Kubeflow', 'Collaborate with research team on model improvements', 'Monitor and maintain deployed models'],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLflow', 'Kubernetes', 'SQL'],
    type: 'Full-time', location: 'Hyderabad, India', isRemote: true,
    salaryMin: 2800000, salaryMax: 4200000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Senior Level', category: 'Data & AI', company: companies[4],
    perks: ['Research time', 'Conference budget', 'ESOP', 'Premium health coverage'],
    tags: ['AI/ML', 'Remote', 'Research-driven'],
  },
  {
    title: 'DevOps Engineer',
    description: 'Keep our platform humming at scale. You\'ll own CI/CD, infrastructure-as-code, and reliability engineering for a platform serving millions of users.',
    requirements: ['4+ years in DevOps/SRE', 'Strong Kubernetes and Terraform knowledge', 'Experience with AWS/GCP', 'Understanding of SLOs/SLAs'],
    responsibilities: ['Build and maintain CI/CD pipelines', 'Manage Kubernetes clusters', 'Implement monitoring and alerting', 'Lead on-call rotations'],
    skills: ['Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus', 'Grafana'],
    type: 'Full-time', location: 'Pune, India', isRemote: true,
    salaryMin: 2000000, salaryMax: 3200000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Engineering', company: companies[0],
    perks: ['Remote-first', 'Equity', 'Learning budget', 'Home office setup'],
    tags: ['Remote', 'DevOps', 'SRE'],
  },
  {
    title: 'UX Research Lead',
    description: 'Champion the user voice. You\'ll design and run research programs — qualitative and quantitative — that give our teams deep customer empathy and shape our roadmap.',
    requirements: ['5+ years in UX research', 'Mixed-methods research expertise', 'Experience presenting to senior leadership', 'Proficiency with research tools'],
    responsibilities: ['Plan and execute user research studies', 'Synthesize insights into actionable recommendations', 'Build the UX research practice', 'Work closely with design and product'],
    skills: ['User Interviews', 'Usability Testing', 'Dovetail', 'Figma', 'SQL', 'Statistics'],
    type: 'Full-time', location: 'Chennai, India', isRemote: false,
    salaryMin: 1800000, salaryMax: 2800000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Senior Level', category: 'Design', company: companies[1],
    perks: ['Research tool budget', 'Conference speaking opportunities', 'Flexible schedule', 'Gym membership'],
    tags: ['Leadership', 'In-office', 'Research'],
  },
  {
    title: 'Frontend Engineer — Design Systems',
    description: 'Build the components that power every product. You\'ll work at the intersection of design and engineering, creating a component library used by dozens of teams.',
    requirements: ['3+ years in frontend engineering', 'Deep React and TypeScript expertise', 'Experience building component libraries', 'Strong eye for design details'],
    responsibilities: ['Build and maintain the component library', 'Write comprehensive documentation and Storybook stories', 'Collaborate closely with designers', 'Ensure WCAG accessibility compliance'],
    skills: ['React', 'TypeScript', 'Storybook', 'CSS', 'Figma', 'Radix UI'],
    type: 'Full-time', location: 'Bangalore, India', isRemote: true,
    salaryMin: 1800000, salaryMax: 2800000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Engineering', company: companies[5],
    perks: ['Fully remote', 'Tech stipend', 'Stock options', 'Unlimited PTO'],
    tags: ['Remote', 'Design Systems', 'Components'],
  },
  {
    title: 'Data Analyst — Business Intelligence',
    description: 'Transform raw data into stories that drive decisions. You\'ll own our BI stack, build dashboards that executives love, and surface insights that change how we operate.',
    requirements: ['3+ years in data analytics or BI', 'Advanced SQL skills', 'Experience with Looker, Tableau, or similar', 'Strong business acumen'],
    responsibilities: ['Build and maintain executive dashboards', 'Own the data warehouse and transformation pipelines', 'Partner with business units on analytical needs', 'Champion data literacy across the company'],
    skills: ['SQL', 'Looker', 'dbt', 'Python', 'BigQuery', 'Tableau'],
    type: 'Full-time', location: 'Gurgaon, India', isRemote: false,
    salaryMin: 1400000, salaryMax: 2200000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Data & AI', company: companies[2],
    perks: ['Annual bonus', 'Health insurance', 'Learning allowance', 'Flexible hours'],
    tags: ['Data', 'BI', 'Analytics'],
  },
  {
    title: 'Clinical Product Manager',
    description: 'Navigate the complexity of healthcare product. You\'ll work with clinicians, regulators, and engineers to build products that comply with HIPAA, NABH, and genuinely improve patient outcomes.',
    requirements: ['4+ years in healthcare product management', 'Understanding of clinical workflows', 'Experience with health regulations', 'MBA or clinical background preferred'],
    responsibilities: ['Define clinical product roadmap', 'Work with clinical advisors and regulators', 'Drive compliance requirements into product', 'Measure and improve clinical outcomes'],
    skills: ['Product Management', 'Healthcare IT', 'HIPAA', 'JIRA', 'Clinical Workflows', 'SQL'],
    type: 'Full-time', location: 'Bangalore, India', isRemote: false,
    salaryMin: 2200000, salaryMax: 3500000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Senior Level', category: 'Healthcare', company: companies[3],
    perks: ['Mission-driven work', 'Competitive salary', 'Health benefits', 'Flexible leave'],
    tags: ['Healthcare', 'Impact', 'Regulatory'],
  },
  {
    title: 'Growth Marketing Manager',
    description: 'Scale our user acquisition engine. You\'ll own paid channels, SEO strategy, and lifecycle marketing — with full autonomy to experiment and a real budget to work with.',
    requirements: ['4+ years in growth or performance marketing', 'Deep knowledge of paid channels (Google, Meta)', 'SEO expertise', 'Data-driven mindset'],
    responsibilities: ['Own CAC and LTV metrics across channels', 'Run paid acquisition campaigns', 'Build SEO strategy and content calendar', 'Design and analyze growth experiments'],
    skills: ['Google Ads', 'Meta Ads', 'SEO', 'HubSpot', 'SQL', 'Google Analytics'],
    type: 'Full-time', location: 'Mumbai, India', isRemote: true,
    salaryMin: 1600000, salaryMax: 2400000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Marketing', company: companies[5],
    perks: ['Marketing budget ownership', 'Performance bonuses', 'Remote work', 'Team retreats'],
    tags: ['Marketing', 'Growth', 'Remote'],
  },
  {
    title: 'iOS Engineer',
    description: 'Build beautiful native experiences for millions of users. You\'ll own features across the iOS app — from camera integrations to SwiftUI-powered onboarding.',
    requirements: ['4+ years in iOS development', 'Swift and SwiftUI expertise', 'Experience with RESTful APIs', 'Published apps in App Store'],
    responsibilities: ['Build and ship iOS features', 'Optimize app performance and memory usage', 'Write unit and UI tests', 'Collaborate with design on custom animations'],
    skills: ['Swift', 'SwiftUI', 'Xcode', 'Core Data', 'Combine', 'TestFlight'],
    type: 'Full-time', location: 'Bangalore, India', isRemote: true,
    salaryMin: 2000000, salaryMax: 3200000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Engineering', company: companies[4],
    perks: ['Remote-first', 'Latest MacBook & iPhone', 'ESOP', 'Wellness budget'],
    tags: ['Mobile', 'iOS', 'Remote'],
  },
  {
    title: 'Content Strategist',
    description: 'Words that move people. You\'ll craft the editorial voice of our brand across blog posts, product copy, social media, and long-form storytelling.',
    requirements: ['3+ years in content strategy or copywriting', 'Strong portfolio of written work', 'Understanding of SEO principles', 'Experience with B2B or SaaS brands'],
    responsibilities: ['Develop and execute content calendar', 'Write and edit long-form content', 'Work with design on content production', 'Measure content performance'],
    skills: ['Copywriting', 'SEO', 'Notion', 'WordPress', 'Analytics', 'Brand Voice'],
    type: 'Part-time', location: 'Remote, India', isRemote: true,
    salaryMin: 800000, salaryMax: 1400000, salaryCurrency: 'INR', salaryPeriod: 'yearly',
    experience: 'Mid Level', category: 'Marketing', company: companies[1],
    perks: ['Fully remote', 'Flexible schedule', 'Published bylines', 'Professional growth'],
    tags: ['Content', 'Remote', 'Part-time'],
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create employer users
    const employers = await Promise.all(
      companies.map((company, i) =>
        User.create({
          name: `${company.name} Hiring`,
          email: `hiring${i + 1}@${company.name.toLowerCase().replace(/\s/g, '')}.com`,
          password: 'Password123!',
          role: 'employer',
          companyName: company.name,
          companyLogo: company.logo,
          companyIndustry: company.industry,
          companySize: company.size,
          companyWebsite: company.website,
          companyDescription: `${company.name} is a leading company in the ${company.industry} industry, focused on innovation and excellence.`,
        })
      )
    );
    console.log(`✅ Created ${employers.length} employer accounts`);

    // Create seeker users
    const seekers = await Promise.all([
      User.create({ name: 'Arjun Sharma', email: 'arjun@example.com', password: 'Password123!', role: 'seeker', headline: 'Full-Stack Developer | React & Node.js', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], location: 'Bangalore, India' }),
      User.create({ name: 'Priya Nair', email: 'priya@example.com', password: 'Password123!', role: 'seeker', headline: 'UX Designer | Figma Expert', skills: ['Figma', 'User Research', 'Prototyping', 'CSS'], location: 'Mumbai, India' }),
      User.create({ name: 'Rahul Gupta', email: 'rahul@example.com', password: 'Password123!', role: 'seeker', headline: 'Data Scientist | ML & Python', skills: ['Python', 'TensorFlow', 'SQL', 'Tableau'], location: 'Hyderabad, India' }),
    ]);
    console.log(`✅ Created ${seekers.length} seeker accounts`);

    // Create jobs — assign to appropriate employers
    const companyEmployerMap = {};
    employers.forEach((emp) => { companyEmployerMap[emp.companyName] = emp._id; });

    const jobsWithEmployers = jobsData.map((job) => ({
      ...job,
      postedBy: companyEmployerMap[job.company.name] || employers[0]._id,
    }));

    const jobs = await Job.insertMany(jobsWithEmployers);
    console.log(`✅ Created ${jobs.length} job listings`);

    // Create some sample applications
    await Application.create([
      { job: jobs[0]._id, applicant: seekers[0]._id, coverLetter: 'I am very excited about this opportunity...', status: 'shortlisted' },
      { job: jobs[1]._id, applicant: seekers[1]._id, coverLetter: 'My design work spans brand and motion...', status: 'reviewed' },
      { job: jobs[3]._id, applicant: seekers[2]._id, coverLetter: 'My ML experience in production systems...', status: 'pending' },
    ]);
    console.log('✅ Created sample applications');

    console.log('\n🌿 Seed complete! Here are your test accounts:');
    console.log('👤 Seeker: arjun@example.com / Password123!');
    console.log('👤 Seeker: priya@example.com / Password123!');
    console.log('🏢 Employer: hiring1@luminarylabs.com / Password123!');
    console.log('🏢 Employer: hiring2@verdantstudio.com / Password123!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
