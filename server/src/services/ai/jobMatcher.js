/**
 * Calculate Explainable Match Score between Student Profile and Job Listing
 */
const calculateJobMatch = (studentUser = {}, job = {}) => {
  const studentSkills = [
    ...(studentUser.skills?.languages || []),
    ...(studentUser.skills?.frameworks || []),
    ...(studentUser.skills?.databases || []),
    ...(studentUser.skills?.tools || []),
    ...(studentUser.skills?.softSkills || [])
  ].map(s => s.toLowerCase().trim());

  const requiredSkills = (job.requiredSkills || []).map(s => s.trim());
  const preferredSkills = (job.preferredSkills || []).map(s => s.trim());

  const matchedRequired = [];
  const missingRequired = [];

  requiredSkills.forEach(reqSkill => {
    const isMatched = studentSkills.some(userSkill => {
      const u = userSkill.replace(/[^a-z0-9]/g, '');
      const r = reqSkill.toLowerCase().replace(/[^a-z0-9]/g, '');
      return u.includes(r) || r.includes(u);
    });

    if (isMatched) {
      matchedRequired.push(reqSkill);
    } else {
      missingRequired.push(reqSkill);
    }
  });

  const matchedPreferred = [];
  preferredSkills.forEach(prefSkill => {
    const isMatched = studentSkills.some(userSkill => {
      const u = userSkill.replace(/[^a-z0-9]/g, '');
      const p = prefSkill.toLowerCase().replace(/[^a-z0-9]/g, '');
      return u.includes(p) || p.includes(u);
    });
    if (isMatched) matchedPreferred.push(prefSkill);
  });

  // Base score based on required skills (70% weight) and preferred skills (30% weight)
  const reqMatchRatio = requiredSkills.length > 0 ? (matchedRequired.length / requiredSkills.length) : 1;
  const prefMatchRatio = preferredSkills.length > 0 ? (matchedPreferred.length / preferredSkills.length) : 0.5;

  let matchPercentage = Math.round((reqMatchRatio * 75) + (prefMatchRatio * 25));
  matchPercentage = Math.max(30, Math.min(98, matchPercentage));

  // Build Explainability Reasons ("Why you're a good match")
  const whyMatchReasons = [
    `✓ ${matchedRequired.length} of ${requiredSkills.length} required core skills matched (${matchedRequired.slice(0, 4).join(', ')})`,
  ];

  if (studentUser.careerPreferences?.targetRole && job.title.toLowerCase().includes(studentUser.careerPreferences.targetRole.toLowerCase().split(' ')[0])) {
    whyMatchReasons.push(`✓ Target role "${studentUser.careerPreferences.targetRole}" matches this job posting`);
  }

  if (studentUser.projects && studentUser.projects.length > 0) {
    whyMatchReasons.push(`✓ Practical project portfolio demonstrates hands-on implementation`);
  }

  if (studentUser.education?.degree) {
    whyMatchReasons.push(`✓ Education background in ${studentUser.education.degree} (${studentUser.education.department || 'Computer Science'}) meets requirement`);
  }

  // Improvement Suggestions
  const improvementSuggestions = missingRequired.length > 0
    ? missingRequired.map(skill => `→ Learn ${skill} to increase your candidate rank`)
    : ['→ Add a portfolio project showcasing cloud deployment or microservices'];

  return {
    matchPercentage,
    matchedRequired,
    missingRequired,
    matchedPreferred,
    whyMatchReasons,
    improvementSuggestions
  };
};

module.exports = {
  calculateJobMatch
};
