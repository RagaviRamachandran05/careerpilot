const { generateAIContent } = require('./geminiClient');

/**
 * Generate a multi-month/phase personalized learning roadmap
 */
const generateRoadmapWithAI = async (targetRole = 'Full Stack Developer', missingSkills = [], studentLevel = 'Intermediate') => {
  const skillsListStr = missingSkills.length > 0 ? missingSkills.join(', ') : 'REST APIs, Docker, System Design, Caching';

  const prompt = `
You are an expert Computer Science Professor and Technical Career Coach.
Create a structured 4-phase (Month 1 to Month 4) personalized learning roadmap for a student aiming to become a "${targetRole}".
The student currently lacks these key skills: ${skillsListStr}.

For each phase/topic, provide:
- topicId (e.g. "p1_topic")
- title
- description
- category (e.g. "Backend", "Frontend", "Database", "DevOps", "Core")
- difficulty ("Beginner", "Intermediate", "Advanced")
- estimatedHours (e.g. 10 to 18)
- monthPhase ("Month 1", "Month 2", "Month 3", "Month 4")
- phaseOrder (1, 2, 3, 4)
- prerequisites (Array of strings)
- keyConcepts (Array of strings)
- projectIdea: { title, description }
- recommendedResources: Array of { title, type ("Course"|"Article"|"Video"|"Documentation"), url, provider, isFree }

Also provide an "aiRecommendation" object explaining what the student should focus on right now and why.

Return ONLY a valid JSON object matching this schema:
{
  "title": "${targetRole} Placement Acceleration Roadmap",
  "overview": "Detailed overview...",
  "topics": [
    {
      "topicId": "t1",
      "title": "...",
      "description": "...",
      "category": "...",
      "difficulty": "Intermediate",
      "estimatedHours": 14,
      "monthPhase": "Month 1",
      "phaseOrder": 1,
      "prerequisites": ["..."],
      "keyConcepts": ["..."],
      "projectIdea": {
        "title": "...",
        "description": "..."
      },
      "recommendedResources": [
        {
          "title": "...",
          "type": "Documentation",
          "url": "https://developer.mozilla.org",
          "provider": "Official Docs",
          "isFree": true
        }
      ],
      "status": "Not Started"
    }
  ],
  "aiRecommendation": {
    "currentFocus": "...",
    "reasoning": "...",
    "nextAction": "..."
  }
}
`;

  try {
    const aiResponse = await generateAIContent(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.topics && parsed.topics.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('AI Roadmap generator fallback:', err.message);
  }

  // Heuristic Fallback Roadmap Generator dynamically adapted to targetRole and missingSkills
  const getRoleTopics = (role, missing) => {
    const roleLower = (role || '').toLowerCase();
    const skillsList = missing && missing.length > 0 ? missing : ['Core Concepts', 'Advanced Architecture', 'Production Deployment'];

    if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('machine learning')) {
      return [
        {
          topicId: 'm1_aiml',
          title: `Data Preprocessing & Mathematical Foundations (${missing[0] || 'NumPy & Pandas'})`,
          description: 'Master data pipelines, vector math, tensor operations, feature scaling, and statistical distributions.',
          category: 'AI/ML Core',
          difficulty: 'Intermediate',
          estimatedHours: 16,
          monthPhase: 'Month 1',
          phaseOrder: 1,
          prerequisites: ['Python Programming', 'Linear Algebra Basics'],
          keyConcepts: ['Tensor Operations', 'Feature Engineering', 'Data Imputation', 'Pandas Vectorization'],
          projectIdea: {
            title: 'Automated Exploratory Data Analysis & Preprocessing Pipeline',
            description: 'Build a reusable Python module that cleans, validates, and visualizes complex tabular datasets.'
          },
          recommendedResources: [
            { title: 'Kaggle Python & Pandas Track', type: 'Course', url: 'https://kaggle.com/learn', provider: 'Kaggle', isFree: true },
            { title: 'Scikit-Learn Official User Guide', type: 'Documentation', url: 'https://scikit-learn.org', provider: 'Scikit-Learn', isFree: true }
          ],
          status: 'Not Started'
        },
        {
          topicId: 'm2_aiml',
          title: `Supervised & Unsupervised Machine Learning (${missing[1] || 'Scikit-Learn & XGBoost'})`,
          description: 'Train classification, regression, clustering, and ensemble gradient boosting algorithms with cross-validation.',
          category: 'Algorithms',
          difficulty: 'Intermediate',
          estimatedHours: 18,
          monthPhase: 'Month 2',
          phaseOrder: 2,
          prerequisites: ['Data Preprocessing'],
          keyConcepts: ['Cross Validation & ROC-AUC', 'Random Forests & XGBoost', 'Hyperparameter Tuning', 'Overfitting Regularization'],
          projectIdea: {
            title: 'Predictive Placement Analytics Model',
            description: 'Train an ensemble model predicting student placement probability based on test scores and skill tags.'
          },
          recommendedResources: [
            { title: 'Fast.ai Practical Deep Learning', type: 'Course', url: 'https://course.fast.ai', provider: 'Fast.ai', isFree: true }
          ],
          status: 'Not Started'
        },
        {
          topicId: 'm3_aiml',
          title: `Deep Learning, PyTorch & Neural Networks (${missing[2] || 'PyTorch / TensorFlow'})`,
          description: 'Construct multi-layer perceptrons, convolutional networks (CNNs), transformers, and fine-tune pre-trained vision/NLP models.',
          category: 'Deep Learning',
          difficulty: 'Advanced',
          estimatedHours: 20,
          monthPhase: 'Month 3',
          phaseOrder: 3,
          prerequisites: ['Calculus & Matrix Operations'],
          keyConcepts: ['Backpropagation & Loss Functions', 'PyTorch Tensors & Autograd', 'Transfer Learning', 'Transformer Architecture'],
          projectIdea: {
            title: 'Resume Document Classifier with PyTorch',
            description: 'Build a transformer-based neural network classifying resume paragraphs into standard ATS entities.'
          },
          recommendedResources: [
            { title: 'PyTorch Official Deep Learning Tutorials', type: 'Documentation', url: 'https://pytorch.org/tutorials', provider: 'PyTorch', isFree: true }
          ],
          status: 'Not Started'
        },
        {
          topicId: 'm4_aiml',
          title: `MLOps, Model Serving & LLM Orchestration (${missing[3] || 'FastAPI, Docker & LangChain'})`,
          description: 'Containerize trained models, build low-latency inference REST APIs with FastAPI, and deploy LLM agent pipelines.',
          category: 'MLOps',
          difficulty: 'Advanced',
          estimatedHours: 18,
          monthPhase: 'Month 4',
          phaseOrder: 4,
          prerequisites: ['Deep Learning', 'Basic Docker'],
          keyConcepts: ['FastAPI Asynchronous Serving', 'Model Quantization (ONNX)', 'Vector DBs & RAG', 'CI/CD Model Pipelines'],
          projectIdea: {
            title: 'Production RAG Retrieval Agent with Vector DB',
            description: 'Deploy an end-to-end containerized question-answering microservice over PDF documents with Gemini/LangChain.'
          },
          recommendedResources: [
            { title: 'Full Stack LLM BootCamp', type: 'Course', url: 'https://fullstackdeeplearning.com', provider: 'FSDL', isFree: true }
          ],
          status: 'Not Started'
        }
      ];
    }

    if (roleLower.includes('frontend')) {
      return [
        {
          topicId: 'm1_fe',
          title: `Modern Component Architecture & State Management (${missing[0] || 'React 18 & Context/Redux'})`,
          description: 'Master advanced React hooks, custom hooks, atomic state management, and optimized render lifecycles.',
          category: 'Frontend',
          difficulty: 'Intermediate',
          estimatedHours: 14,
          monthPhase: 'Month 1',
          phaseOrder: 1,
          prerequisites: ['HTML5, Modern ES6+ JavaScript'],
          keyConcepts: ['useReducer & Context', 'Custom Hook Extraction', 'Memoization (useMemo/useCallback)', 'Component Composition'],
          projectIdea: {
            title: 'Interactive Project Management Kanban Studio',
            description: 'Build a fluid drag-and-drop task dashboard with persistent state and optimistic UI updates.'
          },
          recommendedResources: [
            { title: 'React.dev Official Interactive Docs', type: 'Documentation', url: 'https://react.dev', provider: 'React Core Team', isFree: true }
          ],
          status: 'Not Started'
        },
        {
          topicId: 'm2_fe',
          title: `Styling Systems, Design Tokens & Responsive UI (${missing[1] || 'CSS Design Systems & Animations'})`,
          description: 'Implement modern design systems with CSS custom properties, grid layouts, glassmorphic themes, and micro-interactions.',
          category: 'UI/UX & CSS',
          difficulty: 'Intermediate',
          estimatedHours: 12,
          monthPhase: 'Month 2',
          phaseOrder: 2,
          prerequisites: ['CSS Basics'],
          keyConcepts: ['CSS Variables & Themes', 'Grid & Subgrid', 'Accessible ARIA Attributes', 'Keyframe Micro-Animations'],
          projectIdea: {
            title: 'Glassmorphic Multi-Theme Component Library',
            description: 'Construct a standalone accessible design token library with live dark/light mode toggles.'
          },
          recommendedResources: [
            { title: 'MDN CSS Layout Masterclass', type: 'Documentation', url: 'https://developer.mozilla.org', provider: 'MDN', isFree: true }
          ],
          status: 'Not Started'
        },
        {
          topicId: 'm3_fe',
          title: `Performance Optimization, Web Vitals & TypeScript (${missing[2] || 'TypeScript & Web Vitals'})`,
          description: 'Master strict TypeScript typings, code-splitting, lazy loading, Core Web Vitals profiling, and caching.',
          category: 'Performance',
          difficulty: 'Advanced',
          estimatedHours: 16,
          monthPhase: 'Month 3',
          phaseOrder: 3,
          prerequisites: ['React Architecture'],
          keyConcepts: ['TypeScript Generics', 'Bundle Splitting (React.lazy)', 'Lighthouse Web Vitals', 'Network Request Debouncing'],
          projectIdea: {
            title: 'High-Throughput Financial Data Dashboard',
            description: 'Build an ultra-fast stock chart viewer using typed TypeScript and virtualized scrolling lists.'
          },
          recommendedResources: [
            { title: 'TypeScript Handbook', type: 'Documentation', url: 'https://www.typescriptlang.org/docs', provider: 'Microsoft', isFree: true }
          ],
          status: 'Not Started'
        },
        {
          topicId: 'm4_fe',
          title: `Testing, CI/CD & Production Deployment (${missing[3] || 'Jest, React Testing Library & CI'})`,
          description: 'Write robust unit and integration tests with Jest, RTL, mock service workers, and automate deployments on Vercel.',
          category: 'Testing & DevOps',
          difficulty: 'Advanced',
          estimatedHours: 14,
          monthPhase: 'Month 4',
          phaseOrder: 4,
          prerequisites: ['TypeScript & Components'],
          keyConcepts: ['Unit & Integration Testing', 'Mock Service Worker (MSW)', 'E2E Testing with Playwright', 'Automated GitHub Actions CI'],
          projectIdea: {
            title: 'Production CI-Tested Multi-Tenant Web App',
            description: 'Setup continuous integration testing with 100% critical route coverage and automated preview deployments.'
          },
          recommendedResources: [
            { title: 'Testing JavaScript Guide by Kent C. Dodds', type: 'Course', url: 'https://testingjavascript.com', provider: 'Kent Dodds', isFree: true }
          ],
          status: 'Not Started'
        }
      ];
    }

    // Default Full Stack / Backend / General Engineering Track
    return [
      {
        topicId: 'm1_core',
        title: `RESTful API Architecture & Authentication (${missing[0] || 'Express.js & JWT Security'})`,
        description: 'Master modular architectural principles, route separation, robust error handlers, and authentication security.',
        category: 'Backend',
        difficulty: 'Intermediate',
        estimatedHours: 14,
        monthPhase: 'Month 1',
        phaseOrder: 1,
        prerequisites: ['Basic JavaScript / Node.js'],
        keyConcepts: ['REST Architecture', 'Middleware Chains', 'JWT Authentication', 'Error Handling'],
        projectIdea: {
          title: 'Secure Multi-Role API Gateway',
          description: 'Build a production-ready authentication & CRUD API service with rate limiting and validation.'
        },
        recommendedResources: [
          { title: 'Full Stack Open API Guide', type: 'Course', url: 'https://fullstackopen.com', provider: 'Univ of Helsinki', isFree: true },
          { title: 'MDN Web Architecture Docs', type: 'Documentation', url: 'https://developer.mozilla.org', provider: 'MDN', isFree: true }
        ],
        status: 'Not Started'
      },
      {
        topicId: 'm2_db',
        title: `Database Modeling, Aggregation & Caching (${missing[1] || 'MongoDB & Redis'})`,
        description: 'Design scalable database schemas, indexing strategies, relationships, and caching layers with Redis and MongoDB.',
        category: 'Database',
        difficulty: 'Intermediate',
        estimatedHours: 14,
        monthPhase: 'Month 2',
        phaseOrder: 2,
        prerequisites: ['Basic CRUD'],
        keyConcepts: ['Indexing & Execution Plans', 'Aggregation Pipelines', 'Transactions', 'Redis Caching & TTL'],
        projectIdea: {
          title: 'High-Throughput Analytics Store with Redis Cache',
          description: 'Implement complex aggregation queries and cached metrics dashboards with sub-10ms response times.'
        },
        recommendedResources: [
          { title: 'MongoDB University Tutorials', type: 'Course', url: 'https://learn.mongodb.com', provider: 'MongoDB', isFree: true }
        ],
        status: 'Not Started'
      },
      {
        topicId: 'm3_devops',
        title: `Docker Containerization & CI/CD Pipelines (${missing[2] || 'Docker & GitHub Actions'})`,
        description: 'Create multi-stage Docker builds, docker-compose orchestration, and automated GitHub Actions test & deploy workflows.',
        category: 'DevOps',
        difficulty: 'Advanced',
        estimatedHours: 16,
        monthPhase: 'Month 3',
        phaseOrder: 3,
        prerequisites: ['Basic Terminal Commands'],
        keyConcepts: ['Dockerfile Multi-stage', 'Container Networking', 'GitHub Actions CI', 'Environment Management'],
        projectIdea: {
          title: 'Automated Containerized Deployment Pipeline',
          description: 'Containerize both client and server applications and deploy via CI/CD pipelines.'
        },
        recommendedResources: [
          { title: 'Docker 101 Official Guide', type: 'Documentation', url: 'https://docker.com', provider: 'Docker', isFree: true }
        ],
        status: 'Not Started'
      },
      {
        topicId: 'm4_systemdesign',
        title: `System Design & High-Concurrency Architecture (${missing[3] || 'Scalability & Microservices'})`,
        description: 'Understand load balancers, caching strategies, rate limiters, database sharding, and CAP theorem for placement interviews.',
        category: 'Architecture',
        difficulty: 'Advanced',
        estimatedHours: 18,
        monthPhase: 'Month 4',
        phaseOrder: 4,
        prerequisites: ['Backend & Database Fundamentals'],
        keyConcepts: ['Load Balancing', 'Consistent Hashing', 'Message Queues (Kafka/RabbitMQ)', 'Horizontal Scaling'],
        projectIdea: {
          title: 'Distributed URL Shortener or Real-Time Chat System',
          description: 'Design and benchmark a scalable service handling high request concurrency.'
        },
        recommendedResources: [
          { title: 'System Design Primer', type: 'Article', url: 'https://github.com/donnemartin/system-design-primer', provider: 'GitHub', isFree: true }
        ],
        status: 'Not Started'
      }
    ];
  };

  const sampleTopics = getRoleTopics(targetRole, missingSkills);

  return {
    title: `${targetRole} Placement Acceleration Pathway`,
    overview: `A curated 4-phase developmental curriculum tailored to bridge identified skill gaps in ${skillsListStr}.`,
    topics: sampleTopics,
    aiRecommendation: {
      currentFocus: sampleTopics[0].title,
      reasoning: `You have foundational technical competencies, but mastering "${sampleTopics[0].title}" is critical for upcoming ${targetRole} placement rounds.`,
      nextAction: `Begin with Topic 1: "${sampleTopics[0].title}" and implement the recommended milestone project.`
    }
  };
};

module.exports = {
  generateRoadmapWithAI
};
