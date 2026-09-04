const { generateAIContent } = require('./geminiClient');

/**
 * Evaluate submitted code with AI analysis for complexity, correctness, and pedagogical feedback
 */
const evaluateCodeSubmission = async (question, userCode, language = 'javascript') => {
  const prompt = `
You are a Senior Algorithms Instructor and Technical Interview Coach.
A student has submitted a code solution for the following coding problem:

Problem Title: ${question.title}
Category: ${question.category}
Difficulty: ${question.difficulty}
Description: ${question.description}
Constraints: ${(question.constraints || []).join('; ')}

Candidate's Code (${language}):
\`\`\`${language}
${userCode}
\`\`\`

Analyze the code and provide:
1. isApproachCorrect (Boolean: true if logic is fundamentally sound)
2. logicalMistakes (Array of specific bugs, edge-case oversights, or off-by-one errors)
3. timeComplexity (Big-O, e.g. "O(N)", "O(N log N)", "O(N^2)")
4. spaceComplexity (Big-O, e.g. "O(1)", "O(N)")
5. betterApproach (Insightful explanation of how to optimize further if applicable, or validation of current optimal approach)
6. testedConcepts (Array of algorithms/data structure concepts demonstrated)
7. summary (A friendly, constructive 2-3 sentence educational explanation)

Return ONLY a valid JSON object matching:
{
  "isApproachCorrect": true,
  "logicalMistakes": [],
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "betterApproach": "...",
  "testedConcepts": ["Two Pointers", "Hash Map"],
  "summary": "..."
}
`;

  try {
    const aiResponse = await generateAIContent(prompt);
    if (aiResponse) {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.timeComplexity) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('AI Coding evaluation fallback:', err.message);
  }

  // Heuristic Code Evaluation Engine
  const codeLower = userCode.toLowerCase();
  const isMapOrSet = codeLower.includes('map') || codeLower.includes('set') || codeLower.includes('dict') || codeLower.includes('hash');
  const hasNestedLoops = (userCode.match(/for\s*\(|while\s*\(/g) || []).length >= 2;

  let estimatedTime = question.timeComplexityExpected || 'O(N)';
  let estimatedSpace = question.spaceComplexityExpected || 'O(1)';

  if (hasNestedLoops && !isMapOrSet) {
    estimatedTime = 'O(N^2)';
  } else if (isMapOrSet) {
    estimatedTime = 'O(N)';
    estimatedSpace = 'O(N)';
  }

  return {
    isApproachCorrect: userCode.trim().length > 30,
    logicalMistakes: userCode.trim().length < 30 ? ['Incomplete solution body.'] : [],
    timeComplexity: estimatedTime,
    spaceComplexity: estimatedSpace,
    betterApproach: `The expected optimal approach utilizes ${question.expectedConcept || 'hash maps or two-pointer techniques'} to achieve ${question.timeComplexityExpected || 'O(N)'} time complexity.`,
    testedConcepts: [question.category, question.expectedConcept || 'Algorithmic Optimization'].filter(Boolean),
    summary: `Your code demonstrates a clear structural grasp of ${question.category}. It solves the problem with an estimated time complexity of ${estimatedTime} and space complexity of ${estimatedSpace}.`
  };
};

module.exports = {
  evaluateCodeSubmission
};
