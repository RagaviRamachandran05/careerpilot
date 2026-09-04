const { ROLE_KEYWORDS } = require('./resumeAnalyzer');
const { generateAIContent } = require('./geminiClient');

// Comprehensive role requirement benchmarks
const ROLE_SKILL_BENCHMARKS = {
  'Full Stack Developer': [
    { name: 'HTML5 / CSS3', category: 'Frontend', importance: 'Critical' },
    { name: 'JavaScript (ES6+)', category: 'Frontend', importance: 'Critical' },
    { name: 'React.js', category: 'Frontend', importance: 'Critical' },
    { name: 'Node.js', category: 'Backend', importance: 'Critical' },
    { name: 'Express.js', category: 'Backend', importance: 'Critical' },
    { name: 'MongoDB', category: 'Database', importance: 'Critical' },
    { name: 'REST APIs', category: 'Backend', importance: 'Critical' },
    { name: 'Git & GitHub', category: 'DevOps', importance: 'Critical' },
    { name: 'Docker', category: 'DevOps', importance: 'High' },
    { name: 'PostgreSQL / SQL', category: 'Database', importance: 'High' },
    { name: 'TypeScript', category: 'Frontend', importance: 'Medium' },
    { name: 'Redis Caching', category: 'Database', importance: 'Medium' },
    { name: 'System Design Basics', category: 'Architecture', importance: 'High' }
  ],
  'Frontend Developer': [
    { name: 'HTML5 / CSS3', category: 'Frontend', importance: 'Critical' },
    { name: 'JavaScript (ES6+)', category: 'Frontend', importance: 'Critical' },
    { name: 'React.js', category: 'Frontend', importance: 'Critical' },
    { name: 'TypeScript', category: 'Frontend', importance: 'High' },
    { name: 'Responsive Web Design', category: 'Frontend', importance: 'Critical' },
    { name: 'State Management (Redux/Zustand)', category: 'Frontend', importance: 'High' },
    { name: 'TailwindCSS / CSS Modules', category: 'Frontend', importance: 'High' },
    { name: 'Next.js / SSR', category: 'Frontend', importance: 'Medium' },
    { name: 'REST APIs & Fetch', category: 'Integration', importance: 'Critical' },
    { name: 'Git & GitHub', category: 'DevOps', importance: 'Critical' },
    { name: 'Unit Testing (Jest / Vitest)', category: 'Testing', importance: 'Medium' }
  ],
  'Backend Developer': [
    { name: 'Node.js / Express or Python / Java', category: 'Backend', importance: 'Critical' },
    { name: 'REST API Architecture', category: 'Backend', importance: 'Critical' },
    { name: 'SQL & Relational DBs (PostgreSQL/MySQL)', category: 'Database', importance: 'Critical' },
    { name: 'NoSQL Databases (MongoDB)', category: 'Database', importance: 'High' },
    { name: 'Authentication & Security (JWT, OAuth, Bcrypt)', category: 'Security', importance: 'Critical' },
    { name: 'Docker & Containerization', category: 'DevOps', importance: 'High' },
    { name: 'Redis Caching', category: 'Database', importance: 'High' },
    { name: 'Microservices & Message Queues', category: 'Architecture', importance: 'Medium' },
    { name: 'Git & Version Control', category: 'DevOps', importance: 'Critical' },
    { name: 'Data Structures & Algorithms', category: 'Core', importance: 'Critical' }
  ],
  'AI/ML Engineer': [
    { name: 'Python', category: 'Core', importance: 'Critical' },
    { name: 'Data Structures & Algorithms', category: 'Core', importance: 'Critical' },
    { name: 'Mathematics & Linear Algebra', category: 'Theory', importance: 'High' },
    { name: 'Machine Learning (Scikit-Learn)', category: 'ML', importance: 'Critical' },
    { name: 'Deep Learning (PyTorch / TensorFlow)', category: 'ML', importance: 'Critical' },
    { name: 'Data Manipulation (Pandas & NumPy)', category: 'Data', importance: 'Critical' },
    { name: 'NLP / LLM Integration (LangChain, HuggingFace)', category: 'AI', importance: 'High' },
    { name: 'SQL & Data Extraction', category: 'Database', importance: 'High' },
    { name: 'Model Deployment (FastAPI, Docker)', category: 'DevOps', importance: 'High' },
    { name: 'Git & Version Control', category: 'DevOps', importance: 'Critical' }
  ],
  'Data Analyst': [
    { name: 'SQL & Query Optimization', category: 'Database', importance: 'Critical' },
    { name: 'Python for Data Analysis', category: 'Core', importance: 'Critical' },
    { name: 'Pandas & NumPy', category: 'Data', importance: 'Critical' },
    { name: 'Data Visualization (PowerBI / Tableau)', category: 'BI', importance: 'Critical' },
    { name: 'Advanced Microsoft Excel', category: 'Tools', importance: 'High' },
    { name: 'Applied Statistics & Probability', category: 'Theory', importance: 'Critical' },
    { name: 'A/B Testing Methodology', category: 'Analytics', importance: 'Medium' },
    { name: 'Business Communication', category: 'Soft Skills', importance: 'High' }
  ],
  'Java Developer': [
    { name: 'Java (Core & OOP)', category: 'Core', importance: 'Critical' },
    { name: 'Spring Boot Framework', category: 'Backend', importance: 'Critical' },
    { name: 'Hibernate / Spring Data JPA', category: 'Database', importance: 'Critical' },
    { name: 'RESTful Web Services', category: 'Backend', importance: 'Critical' },
    { name: 'SQL Databases (MySQL / Oracle / Postgres)', category: 'Database', importance: 'Critical' },
    { name: 'Data Structures & Algorithms', category: 'Core', importance: 'Critical' },
    { name: 'Git & Maven / Gradle', category: 'Tools', importance: 'High' },
    { name: 'JUnit & Mockito Testing', category: 'Testing', importance: 'High' },
    { name: 'Docker Basics', category: 'DevOps', importance: 'Medium' }
  ],
  'Python Developer': [
    { name: 'Python (OOP, Generators, Async)', category: 'Core', importance: 'Critical' },
    { name: 'Django or FastAPI / Flask', category: 'Backend', importance: 'Critical' },
    { name: 'PostgreSQL / MySQL', category: 'Database', importance: 'Critical' },
    { name: 'REST API Design', category: 'Backend', importance: 'Critical' },
    { name: 'Docker & Containerization', category: 'DevOps', importance: 'High' },
    { name: 'Celery & Redis Background Tasks', category: 'Backend', importance: 'Medium' },
    { name: 'PyTest / Unit Testing', category: 'Testing', importance: 'High' },
    { name: 'Git & CI/CD Basics', category: 'DevOps', importance: 'Critical' }
  ],
  'DevOps Engineer': [
    { name: 'Linux System Administration', category: 'OS', importance: 'Critical' },
    { name: 'Docker & Containers', category: 'DevOps', importance: 'Critical' },
    { name: 'Kubernetes Orchestration', category: 'DevOps', importance: 'High' },
    { name: 'CI/CD Pipelines (GitHub Actions / Jenkins)', category: 'DevOps', importance: 'Critical' },
    { name: 'Infrastructure as Code (Terraform)', category: 'Cloud', importance: 'High' },
    { name: 'Cloud Provider (AWS / GCP / Azure)', category: 'Cloud', importance: 'Critical' },
    { name: 'Scripting (Bash & Python)', category: 'Core', importance: 'Critical' },
    { name: 'Monitoring (Prometheus & Grafana)', category: 'Observability', importance: 'High' },
    { name: 'Git & Version Control', category: 'DevOps', importance: 'Critical' }
  ],
  'UI/UX Designer': [
    { name: 'Figma UI Design', category: 'Design', importance: 'Critical' },
    { name: 'Wireframing & Low-Fi Prototyping', category: 'Design', importance: 'Critical' },
    { name: 'Interactive High-Fi Prototyping', category: 'Design', importance: 'Critical' },
    { name: 'User Research & Personas', category: 'Research', importance: 'Critical' },
    { name: 'Design Systems & Component Libraries', category: 'Design', importance: 'High' },
    { name: 'Usability Testing & Heuristics', category: 'Research', importance: 'High' },
    { name: 'HTML & CSS Fundamentals', category: 'Frontend', importance: 'Medium' },
    { name: 'Visual Hierarchy & Typography', category: 'Design', importance: 'Critical' }
  ]
};

/**
 * Compare student acquired skills vs target role benchmark skills
 */
const analyzeSkillGap = async (studentSkillsObj = {}, targetRole = 'Full Stack Developer') => {
  // Aggregate all student skills
  const studentSkillList = [
    ...(studentSkillsObj.languages || []),
    ...(studentSkillsObj.frameworks || []),
    ...(studentSkillsObj.databases || []),
    ...(studentSkillsObj.tools || []),
    ...(studentSkillsObj.softSkills || [])
  ];

  const benchmark = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS['Full Stack Developer'];

  const acquiredSkills = [];
  const missingSkills = [];

  benchmark.forEach(bSkill => {
    // Check if student has skill (fuzzy match)
    const isAcquired = studentSkillList.some(userSkill => {
      const u = userSkill.toLowerCase().replace(/[^a-z0-9]/g, '');
      const b = bSkill.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return u.includes(b) || b.includes(u);
    });

    if (isAcquired) {
      acquiredSkills.push(bSkill.name);
    } else {
      missingSkills.push(bSkill.name);
    }
  });

  const matchPercentage = Math.round((acquiredSkills.length / benchmark.length) * 100);

  let readinessLevel = 'Beginner';
  if (matchPercentage >= 80) readinessLevel = 'Job Ready';
  else if (matchPercentage >= 50) readinessLevel = 'Intermediate';

  return {
    targetRole,
    benchmarkTotal: benchmark.length,
    acquiredCount: acquiredSkills.length,
    missingCount: missingSkills.length,
    matchPercentage,
    readinessLevel,
    requiredSkills: benchmark,
    acquiredSkills,
    missingSkills,
    categoryBreakdown: {
      Frontend: benchmark.filter(s => s.category === 'Frontend').length,
      Backend: benchmark.filter(s => s.category === 'Backend').length,
      Database: benchmark.filter(s => s.category === 'Database').length,
      DevOps: benchmark.filter(s => s.category === 'DevOps').length,
      Core: benchmark.filter(s => s.category === 'Core').length
    }
  };
};

module.exports = {
  ROLE_SKILL_BENCHMARKS,
  analyzeSkillGap
};
