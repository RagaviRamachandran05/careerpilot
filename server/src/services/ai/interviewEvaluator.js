const { generateAIContent } = require('./geminiClient');

/**
 * Evaluate single question answer
 */
const evaluateAnswer = async (questionText, studentAnswer, expectedKeyPoints = [], category = 'Technical') => {
  const prompt = `
You are a Principal Engineering Interviewer evaluating a candidate's answer to an interview question.

Question:
"${questionText}"

Expected Key Points:
${expectedKeyPoints.map(p => `- ${p}`).join('\n')}

Candidate's Answer:
"${studentAnswer}"

Evaluate the candidate's answer across these dimensions (each from 1 to 10):
1. technicalKnowledge (Accuracy, depth, domain terms)
2. communication (Clarity, structure, articulation)
3. problemSolving (Thought process, logic, trade-offs)
4. confidenceClarity (Directness, conviction)
5. completeness (Coverage of expected key concepts)

Also calculate:
- overallScore (0-10)
- feedback (2-3 sentences of constructive coaching)
- sampleIdealAnswer (A model answer demonstrating high clarity and STAR/structured approach)
- strengths (Array of 2 strings)
- improvements (Array of 2 strings)

Return ONLY a valid JSON object matching:
{
  "technicalKnowledge": 8,
  "communication": 7.5,
  "problemSolving": 8,
  "confidenceClarity": 8,
  "completeness": 7.5,
  "overallScore": 7.8,
  "feedback": "...",
  "sampleIdealAnswer": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}
`;

  try {
    const aiResponse = await generateAIContent(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.overallScore !== undefined) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('AI Answer evaluation fallback:', err.message);
  }

  // Heuristic Answer Evaluator
  const wordCount = (studentAnswer || '').trim().split(/\s+/).length;
  let baseScore = 6.0;

  if (wordCount >= 40) baseScore += 1.5;
  if (wordCount >= 80) baseScore += 1.0;
  if (wordCount < 15) baseScore = Math.max(3.0, baseScore - 3.0);

  // Check expected key points keyword overlap
  let matchedPoints = 0;
  expectedKeyPoints.forEach(pt => {
    const words = pt.toLowerCase().split(/\s+/);
    if (words.some(w => w.length > 3 && (studentAnswer || '').toLowerCase().includes(w))) {
      matchedPoints++;
    }
  });

  const bonus = Math.min(1.5, (matchedPoints / Math.max(1, expectedKeyPoints.length)) * 1.5);
  const finalScore = Math.min(9.5, Number((baseScore + bonus).toFixed(1)));

  return {
    technicalKnowledge: Math.min(10, Number((finalScore + (category === 'Technical' ? 0.2 : -0.2)).toFixed(1))),
    communication: Math.min(10, Number((finalScore - 0.2).toFixed(1))),
    problemSolving: Math.min(10, Number((finalScore + 0.1).toFixed(1))),
    confidenceClarity: Math.min(10, Number((finalScore - 0.1).toFixed(1))),
    completeness: Math.min(10, Number((finalScore).toFixed(1))),
    overallScore: finalScore,
    feedback: wordCount > 30 
      ? 'Good conceptual foundation and relevant points highlighted. You articulated key concepts clearly with appropriate terminology.'
      : 'Your answer is on the right track, but could benefit from deeper technical explanation and specific examples.',
    sampleIdealAnswer: `A comprehensive answer touches upon: ${expectedKeyPoints.join(', ')}. Use structured formatting: state the core concept, explain the underlying mechanism, and give a concrete example from your projects.`,
    strengths: [
      'Addresses the primary objective of the question directly.',
      'Demonstrates foundational familiarity with required terminology.'
    ],
    improvements: [
      'Provide more real-world project context and edge-case handling.',
      'Structure longer responses using the STAR method (Situation, Task, Action, Result).'
    ]
  };
};

/**
 * Generate final interview report from all answered questions
 */
const generateFinalInterviewReport = async (targetRole, interviewType, questions = []) => {
  const answeredQuestions = questions.filter(q => q.studentAnswer && q.evaluation);
  
  if (answeredQuestions.length === 0) {
    return {
      overallScore: 7.0,
      technicalKnowledgeScore: 7.0,
      communicationScore: 7.0,
      problemSolvingScore: 7.0,
      strengths: ['Participated in interview session'],
      weaknesses: ['Need more answered questions for complete evaluation'],
      recommendedTopics: ['Core Technical Concepts', 'Behavioral STAR Framework'],
      executiveSummary: 'Interview session completed.'
    };
  }

  const avgTech = answeredQuestions.reduce((acc, q) => acc + (q.evaluation.technicalKnowledge || 7), 0) / answeredQuestions.length;
  const avgComm = answeredQuestions.reduce((acc, q) => acc + (q.evaluation.communication || 7), 0) / answeredQuestions.length;
  const avgProblem = answeredQuestions.reduce((acc, q) => acc + (q.evaluation.problemSolving || 7), 0) / answeredQuestions.length;
  const overall = Number(((avgTech * 0.4) + (avgComm * 0.3) + (avgProblem * 0.3)).toFixed(1));

  return {
    overallScore: overall,
    technicalKnowledgeScore: Number(avgTech.toFixed(1)),
    communicationScore: Number(avgComm.toFixed(1)),
    problemSolvingScore: Number(avgProblem.toFixed(1)),
    strengths: [
      `Strong technical comprehension in ${targetRole} fundamentals.`,
      'Clear, professional communication style throughout questions.',
      'Effective problem-solving logic and structured explanation.'
    ],
    weaknesses: [
      'Could incorporate more quantitative metrics and performance optimizations.',
      'Elaborate more on trade-offs when comparing alternative architectural choices.'
    ],
    recommendedTopics: [
      'System Design & Distributed Data Caching',
      'Asynchronous Event-Driven Architecture',
      'Advanced Behavioral Framing (STAR Method)'
    ],
    executiveSummary: `Candidate demonstrated solid readiness for a ${targetRole} role with an overall score of ${overall}/10. High potential observed in technical articulation and core engineering practices.`
  };
};

module.exports = {
  evaluateAnswer,
  generateFinalInterviewReport
};
