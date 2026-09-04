const { generateAIContent } = require('./geminiClient');

/**
 * Generate context-aware interview questions tailored to student resume & role
 */
const generateInterviewQuestions = async (targetRole = 'Full Stack Developer', interviewType = 'Mixed', userContext = {}) => {
  const skillsList = userContext.skills ? Object.values(userContext.skills).flat().filter(Boolean).slice(0, 8).join(', ') : 'React, Node.js, Express, MongoDB';
  const projectsList = userContext.projects && userContext.projects.length > 0
    ? userContext.projects.map(p => `${p.title} (${(p.technologies || []).join(', ')})`).join('; ')
    : 'Full-stack web applications';

  const prompt = `
You are a Lead Hiring Manager & Technical Interviewer at a Tier-1 tech company.
Generate a structured 5-question mock interview session for a candidate with the following profile:
- Target Role: ${targetRole}
- Interview Format: ${interviewType} (Technical, HR, or Mixed)
- Candidate Skills: ${skillsList}
- Candidate Projects: ${projectsList}

Guidelines:
1. Make at least 1-2 questions directly refer to their specific projects or technology stack (e.g. "You built a project called SkillSwap using React and Node.js. How did you handle user session state and authentication security?").
2. Include both conceptual deep-dives and real-world scenario/problem-solving questions.
3. For each question provide:
   - questionIndex (0 to 4)
   - questionText
   - category ("Technical", "HR", "Behavioral", "System Design")
   - contextReference (e.g. "Referencing your SkillSwap project" or "Core Architecture")
   - expectedKeyPoints (Array of 3-4 bullet strings candidate should mention)

Return ONLY a valid JSON array of questions matching:
[
  {
    "questionIndex": 0,
    "questionText": "...",
    "category": "Technical",
    "contextReference": "...",
    "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"]
  }
]
`;

  try {
    const aiResponse = await generateAIContent(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('AI Interview question generation fallback:', err.message);
  }

  // Heuristic Context-Aware Fallback Bank
  const firstProject = userContext.projects && userContext.projects[0] ? userContext.projects[0].title : 'your primary web project';
  
  if (interviewType === 'HR') {
    return [
      {
        questionIndex: 0,
        questionText: 'Can you introduce yourself and walk me through your background and interest in ' + targetRole + '?',
        category: 'HR',
        contextReference: 'Personal Introduction',
        expectedKeyPoints: ['Academic background', 'Passions in engineering', 'Target role alignment', 'Career ambitions']
      },
      {
        questionIndex: 1,
        questionText: 'Describe a challenging technical obstacle you encountered while developing ' + firstProject + ' and how you resolved it.',
        category: 'Behavioral',
        contextReference: 'Problem Solving & Resilience',
        expectedKeyPoints: ['Root cause identification', 'Methodical debugging', 'Outcome and learnings']
      },
      {
        questionIndex: 2,
        questionText: 'Tell me about a time you had a disagreement with a peer or teammate during a group project. How did you handle it?',
        category: 'Behavioral',
        contextReference: 'Teamwork & Conflict Resolution',
        expectedKeyPoints: ['Active listening', 'Objective technical discussion', 'Consensus building', 'Professional delivery']
      },
      {
        questionIndex: 3,
        questionText: 'Where do you see yourself technically and professionally in the next 2-3 years?',
        category: 'HR',
        contextReference: 'Growth & Vision',
        expectedKeyPoints: ['Skill depth expansion', 'Mentorship & ownership', 'Impact on product delivery']
      },
      {
        questionIndex: 4,
        questionText: 'Why are you specifically excited about joining our team and working in the ' + targetRole + ' capacity?',
        category: 'HR',
        contextReference: 'Company Alignment',
        expectedKeyPoints: ['Company tech stack alignment', 'Desire for engineering rigor', 'Contribution mindset']
      }
    ];
  }

  // Technical or Mixed Questions
  return [
    {
      questionIndex: 0,
      questionText: `In ${firstProject}, explain your architectural approach for handling user authentication, route protection, and token validation.`,
      category: 'Technical',
      contextReference: `Project Deep-Dive: ${firstProject}`,
      expectedKeyPoints: ['JWT vs Sessions', 'HttpOnly Cookies or Authorization header', 'Middleware route guards', 'Token expiration handling']
    },
    {
      questionIndex: 1,
      questionText: `How does the JavaScript Event Loop work under the hood? Explain the difference between the Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout).`,
      category: 'Technical',
      contextReference: 'Core Language Fundamentals',
      expectedKeyPoints: ['Call Stack execution', 'Microtasks priority', 'Macrotask scheduling', 'Non-blocking I/O']
    },
    {
      questionIndex: 2,
      questionText: `When designing REST APIs, how do you handle error states, pagination, and prevent potential security vulnerabilities like SQL/NoSQL injection?`,
      category: 'Technical',
      contextReference: 'API Design & Security',
      expectedKeyPoints: ['Standard HTTP status codes', 'Cursor / Offset pagination', 'Input sanitization & parameterized queries', 'Global error middleware']
    },
    {
      questionIndex: 3,
      questionText: `Describe how you optimize database performance in MongoDB / SQL when a collection grows to millions of records.`,
      category: 'Technical',
      contextReference: 'Database Optimization',
      expectedKeyPoints: ['Compound Indexing', 'Explain plan analysis', 'Denormalization vs Joins', 'Caching frequently accessed queries with Redis']
    },
    {
      questionIndex: 4,
      questionText: `Tell me about a time you had to learn a completely unfamiliar technology or framework on a tight deadline. How did you approach it?`,
      category: 'Behavioral',
      contextReference: 'Learning Agility & Adaptation',
      expectedKeyPoints: ['Resource selection (Docs vs tutorials)', 'Quick prototyping / POC', 'Iterative implementation', 'Knowledge sharing']
    }
  ];
};

module.exports = {
  generateInterviewQuestions
};
