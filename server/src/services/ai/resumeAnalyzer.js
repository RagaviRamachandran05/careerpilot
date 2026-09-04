const { generateAIContent } = require('./geminiClient');

// Standard keyword lists by target role
const ROLE_KEYWORDS = {
  'Full Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'REST API', 'Git', 'Docker', 'HTML5', 'CSS3', 'SQL', 'PostgreSQL', 'Redux', 'Jest'],
  'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Next.js', 'Redux', 'TailwindCSS', 'Webpack', 'Vite', 'REST API', 'Responsive Design', 'Git', 'Jest'],
  'Backend Developer': ['Node.js', 'Express', 'Python', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'REST API', 'Microservices', 'Git', 'AWS'],
  'AI/ML Engineer': ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'NLP', 'Computer Vision', 'SQL', 'Git', 'Docker'],
  'Data Analyst': ['SQL', 'Python', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'Data Visualization', 'Statistics', 'R', 'A/B Testing'],
  'DevOps Engineer': ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GitHub Actions', 'Terraform', 'Jenkins', 'Bash', 'Python', 'Git', 'Monitoring', 'Prometheus'],
  'Java Developer': ['Java', 'Spring Boot', 'Hibernate', 'Microservices', 'SQL', 'MySQL', 'PostgreSQL', 'REST API', 'Maven', 'Git', 'JUnit', 'Docker'],
  'Python Developer': ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Git', 'Celery', 'Redis', 'Unit Testing'],
  'UI/UX Designer': ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Usability Testing', 'Information Architecture', 'HTML/CSS']
};

/**
 * Safely escape regex special characters
 */
const escapeRegex = (str = '') => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Bulletproof keyword matcher that handles C++, C#, CI/CD, Node.js, etc.
 */
const matchesKeyword = (text = '', keyword = '') => {
  if (!text || !keyword) return false;
  try {
    const isWordStart = /^\w/.test(keyword);
    const isWordEnd = /\w$/.test(keyword);
    const escaped = escapeRegex(keyword);
    const pattern = `${isWordStart ? '\\b' : '(?<=^|\\s|[^a-zA-Z0-9])'}${escaped}${isWordEnd ? '\\b' : '(?=$|\\s|[^a-zA-Z0-9])'}`;
    const regex = new RegExp(pattern, 'i');
    return regex.test(text);
  } catch (err) {
    return text.toLowerCase().includes(keyword.toLowerCase());
  }
};

/**
 * Extract structured information from resume text
 */
const parseResumeText = async (resumeText = '') => {
  const prompt = `
You are an expert AI Resume Parser. Analyze the following resume text and extract structured information strictly as a valid JSON object.
Do not output markdown codeblocks or any additional text.

JSON structure:
{
  "name": "Candidate Full Name",
  "email": "Email address",
  "phone": "Phone number",
  "education": ["Education entry 1", "Education entry 2"],
  "skills": ["Skill 1", "Skill 2", ...],
  "projects": ["Project 1 title and summary", "Project 2..."],
  "experience": ["Experience 1", ...],
  "certifications": ["Certification 1", ...],
  "technologies": ["Tech 1", "Tech 2", ...],
  "achievements": ["Achievement 1", ...]
}

Resume Text:
${resumeText.substring(0, 4000)}
`;

  try {
    const aiResponse = await generateAIContent(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    }
  } catch (err) {
    console.warn('AI parser fallback due to parsing error:', err.message);
  }

  // Heuristic Fallback Parser
  const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
  const emailMatch = resumeText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  const phoneMatch = resumeText.match(/(\+?\d[\d\s-]{8,14}\d)/);
  
  const commonTech = ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'Git', 'Docker', 'AWS', 'HTML', 'CSS', 'PostgreSQL', 'TypeScript', 'Redux', 'Linux', 'Kubernetes', 'CI/CD'];
  const foundSkills = commonTech.filter(skill => matchesKeyword(resumeText, skill));

  return {
    name: lines[0] || 'Candidate',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    education: lines.filter(l => /degree|b\.tech|btech|bachelor|university|college|cgpa|gpa/i.test(l)).slice(0, 3),
    skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    projects: lines.filter(l => /project|app|platform|system|portal|clone/i.test(l)).slice(0, 4),
    experience: lines.filter(l => /intern|developer|engineer|experience|worked|company/i.test(l)).slice(0, 3),
    certifications: lines.filter(l => /certified|certificate|aws|coursera|udemy/i.test(l)).slice(0, 3),
    technologies: foundSkills,
    achievements: lines.filter(l => /award|honor|rank|hackathon|published|olympiad/i.test(l)).slice(0, 3)
  };
};

/**
 * Score Resume and Provide Actionable Feedback
 */
const analyzeResumeWithAI = async (resumeText = '', targetRole = 'Full Stack Developer', parsedData = {}) => {
  const prompt = `
You are a Senior Technical Recruiter and ATS (Applicant Tracking System) Specialist.
Analyze the following candidate's resume for the target role "${targetRole}".

Evaluate the resume across these 7 categories (score each from 0 to 100):
1. skillsScore (Technical breadth and depth)
2. projectsScore (Complexity, architecture, live links)
3. educationScore (Relevance and GPA clarity)
4. experienceScore (Internships/experience context)
5. achievementsScore (Awards, coding ranks, publications)
6. formattingScore (Structure, readability, action verbs)
7. jobRelevanceScore (Alignment with target role "${targetRole}")

Provide exactly 3-4 specific strengths, 2-3 actionable weaknesses, 3-4 concrete improvement suggestions (not generic), and missing keyword gaps.

Return ONLY a valid JSON object matching this schema:
{
  "overallScore": 82,
  "breakdown": {
    "skillsScore": 85,
    "projectsScore": 88,
    "educationScore": 90,
    "experienceScore": 75,
    "achievementsScore": 80,
    "formattingScore": 85,
    "jobRelevanceScore": 82
  },
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "keywordGaps": ["Docker", "Redis", "..."],
  "targetRoleMatch": {
    "role": "${targetRole}",
    "matchScore": 84,
    "matchedKeywords": ["React", "Node.js", "..."],
    "missingKeywords": ["Docker", "Redis", "..."]
  }
}

Resume Content:
${resumeText.substring(0, 4000)}
`;

  try {
    const aiResponse = await generateAIContent(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    }
  } catch (err) {
    console.warn('AI analysis fallback due to error:', err.message);
  }

  // Heuristic ATS Evaluation Engine
  const targetKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Full Stack Developer'];
  const matchedKeywords = targetKeywords.filter(kw => matchesKeyword(resumeText, kw));
  const missingKeywords = targetKeywords.filter(kw => !matchesKeyword(resumeText, kw));

  const keywordMatchRatio = targetKeywords.length > 0 ? (matchedKeywords.length / targetKeywords.length) : 0.5;
  const skillsScore = Math.min(100, Math.round(50 + keywordMatchRatio * 50));
  
  const hasProjects = parsedData.projects && parsedData.projects.length > 0;
  const projectsScore = hasProjects ? Math.min(95, 60 + parsedData.projects.length * 10) : 55;

  const hasEducation = parsedData.education && parsedData.education.length > 0;
  const educationScore = hasEducation ? 88 : 70;

  const hasExperience = parsedData.experience && parsedData.experience.length > 0;
  const experienceScore = hasExperience ? 80 : 60;

  const hasAchievements = parsedData.achievements && parsedData.achievements.length > 0;
  const achievementsScore = hasAchievements ? 82 : 65;

  const formattingScore = resumeText.length > 300 ? 85 : 60;
  const jobRelevanceScore = Math.min(100, Math.round(keywordMatchRatio * 90 + 10));

  const overallScore = Math.round(
    skillsScore * 0.25 +
    projectsScore * 0.25 +
    educationScore * 0.10 +
    experienceScore * 0.15 +
    achievementsScore * 0.10 +
    formattingScore * 0.05 +
    jobRelevanceScore * 0.10
  );

  return {
    overallScore,
    breakdown: {
      skillsScore,
      projectsScore,
      educationScore,
      experienceScore,
      achievementsScore,
      formattingScore,
      jobRelevanceScore
    },
    strengths: [
      `Demonstrates foundational proficiency in core technologies (${matchedKeywords.slice(0, 4).join(', ') || 'Core Technical Stack'}).`,
      hasProjects ? 'Contains relevant practical software projects with technology stack mentions.' : 'Clear academic trajectory and structured degree information.',
      'Well-organized sections suitable for standard automated ATS parsers.'
    ],
    weaknesses: [
      missingKeywords.length > 0 ? `Missing industry-standard keywords for ${targetRole}: ${missingKeywords.slice(0, 3).join(', ')}.` : 'Lacks measurable impact metrics in project summaries.',
      'Could incorporate more quantified outcomes (e.g. "Improved query performance by 40%").'
    ],
    suggestions: [
      `Incorporate key competencies such as ${missingKeywords.slice(0, 3).join(', ') || 'Docker, CI/CD, Unit Testing'} directly into project descriptions.`,
      'Use strong action verbs (Architected, Engineered, Optimized, Deployed) at the start of each bullet point.',
      'Include live GitHub repository URLs and hosted application demo links for all major projects.'
    ],
    keywordGaps: missingKeywords.slice(0, 5),
    targetRoleMatch: {
      role: targetRole,
      matchScore: Math.round(keywordMatchRatio * 100),
      matchedKeywords,
      missingKeywords
    }
  };
};

module.exports = {
  ROLE_KEYWORDS,
  escapeRegex,
  matchesKeyword,
  parseResumeText,
  analyzeResumeWithAI
};
