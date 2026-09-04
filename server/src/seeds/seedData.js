const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const CodingQuestion = require('../models/CodingQuestion');
const Job = require('../models/Job');
const LearningResource = require('../models/LearningResource');
const CareerGoal = require('../models/CareerGoal');
const LearningRoadmap = require('../models/LearningRoadmap');
const Notification = require('../models/Notification');
const Resume = require('../models/Resume');
const Assessment = require('../models/Assessment');
const Interview = require('../models/Interview');

const sampleCodingQuestions = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    category: 'Arrays',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    inputFormat: 'nums = [2,7,11,15], target = 9',
    outputFormat: '[0, 1]',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ],
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', isHidden: false },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', isHidden: false },
      { input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]', isHidden: true }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def twoSum(nums, target):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java solution here\n        return new int[]{};\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your C++ solution here\n        return {};\n    }\n};'
    },
    solutionCode: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); ++i) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) return {seen[comp], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}'
    },
    solutionExplanation: 'Use a Hash Map to store elements and their indices in a single pass. For each element, look up (target - num) in O(1) time.',
    expectedConcept: 'Hash Map Lookup for O(1) instantaneous complement search',
    hints: ['Can you solve this in a single pass?', 'Think about what number you need to find at each index.'],
    timeComplexityExpected: 'O(N)',
    spaceComplexityExpected: 'O(N)',
    acceptanceRate: 88
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    category: 'Strings',
    difficulty: 'Medium',
    description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
    inputFormat: 's = "abcabcbb"',
    outputFormat: '3',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3.' }
    ],
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3', isHidden: false },
      { input: 's = "bbbbb"', expectedOutput: '1', isHidden: false },
      { input: 's = "pwwkew"', expectedOutput: '3', isHidden: true }
    ],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your Java solution here\n        return 0;\n    }\n}',
      cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your C++ solution here\n        return 0;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  let maxLen = 0;\n  let left = 0;\n  const charSet = new Set();\n  for (let right = 0; right < s.length; right++) {\n    while (charSet.has(s[right])) {\n      charSet.delete(s[left]);\n      left++;\n    }\n    charSet.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}',
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = 0\n    res = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        res = max(res, right - left + 1)\n    return res',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int left = 0, max = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            max = Math.max(max, right - left + 1);\n        }\n        return max;\n    }\n}',
      cpp: 'int lengthOfLongestSubstring(string s) {\n    unordered_set<char> set;\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.length(); right++) {\n        while (set.count(s[right])) {\n            set.erase(s[left++]);\n        }\n        set.insert(s[right]);\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}'
    },
    solutionExplanation: 'Sliding window technique maintaining a Set of unique characters. Shrink the window from the left whenever a duplicate is found.',
    expectedConcept: 'Sliding Window + Hash Set',
    hints: ['Use a sliding window with two pointers left and right.', 'Maintain a Set of unique characters currently in the window.'],
    timeComplexityExpected: 'O(N)',
    spaceComplexityExpected: 'O(min(N, M))',
    acceptanceRate: 74
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    category: 'HashMap',
    difficulty: 'Medium',
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    inputFormat: 'strs = ["eat","tea","tan","ate","nat","bat"]',
    outputFormat: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Group words with identical letter counts.' }
    ],
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function groupAnagrams(strs) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def groupAnagrams(strs):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your Java solution here\n        return new ArrayList<>();\n    }\n}',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your C++ solution here\n        return {};\n    }\n};'
    },
    solutionCode: {
      javascript: 'function groupAnagrams(strs) {\n  const map = {};\n  for (const s of strs) {\n    const key = s.split("").sort().join("");\n    if (!map[key]) map[key] = [];\n    map[key].push(s);\n  }\n  return Object.values(map);\n}',
      python: 'def groupAnagrams(strs):\n    from collections import defaultdict\n    mp = defaultdict(list)\n    for s in strs:\n        mp["".join(sorted(s))].append(s)\n    return list(mp.values())',
      java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}',
      cpp: 'vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (string s : strs) {\n        string key = s;\n        sort(key.begin(), key.end());\n        mp[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& p : mp) res.push_back(p.second);\n    return res;\n}'
    },
    solutionExplanation: 'Sort each string alphabetically to form an anagram canonical key, then group matching words into an adjacency map.',
    expectedConcept: 'Hash Table with sorted string signature key',
    hints: ['Two words are anagrams if their sorted string representations are identical.'],
    timeComplexityExpected: 'O(N * K log K)',
    spaceComplexityExpected: 'O(N * K)',
    acceptanceRate: 79
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    category: 'Searching',
    difficulty: 'Medium',
    description: 'There is an integer array `nums` sorted in ascending order (with distinct values) that is rotated at an unknown pivot index. Given `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.',
    inputFormat: 'nums = [4,5,6,7,0,1,2], target = 0',
    outputFormat: '4',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values are unique'],
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: 'Target 0 is found at index 4.' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: 'Target 3 does not exist in array.' }
    ],
    testCases: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', expectedOutput: '4', isHidden: false },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', expectedOutput: '-1', isHidden: false }
    ],
    starterCode: {
      javascript: 'function search(nums, target) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def search(nums, target):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your Java solution here\n        return -1;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your C++ solution here\n        return -1;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function search(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[low] <= nums[mid]) {\n      if (target >= nums[low] && target < nums[mid]) high = mid - 1;\n      else low = mid + 1;\n    } else {\n      if (target > nums[mid] && target <= nums[high]) low = mid + 1;\n      else high = mid - 1;\n    }\n  }\n  return -1;\n}',
      python: 'def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]:\n                r = mid - 1\n            else:\n                l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]:\n                l = mid + 1\n            else:\n                r = mid - 1\n    return -1',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}',
      cpp: 'int search(vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}'
    },
    solutionExplanation: 'Modified binary search: determine which half of the array is sorted, and check whether the target lies inside the sorted half.',
    expectedConcept: 'Modified Binary Search on partially sorted subarrays',
    hints: ['At least one half of the array (left or right of mid) is always sorted in non-decreasing order.'],
    timeComplexityExpected: 'O(log N)',
    spaceComplexityExpected: 'O(1)',
    acceptanceRate: 65
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    category: 'Sorting',
    difficulty: 'Medium',
    description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    inputFormat: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
    outputFormat: '[[1,6],[8,10],[15,18]]',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' }
    ],
    testCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function merge(intervals) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def merge(intervals):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your Java solution here\n        return new int[][]{};\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your C++ solution here\n        return {};\n    }\n};'
    },
    solutionCode: {
      javascript: 'function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}',
      python: 'def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> res = new ArrayList<>();\n        for (int[] interval : intervals) {\n            if (res.isEmpty() || res.get(res.size() - 1)[1] < interval[0]) {\n                res.add(interval);\n            } else {\n                res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], interval[1]);\n            }\n        }\n        return res.toArray(new int[res.size()][]);\n    }\n}',
      cpp: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n    for (auto& interval : intervals) {\n        if (merged.empty() || merged.back()[1] < interval[0]) {\n            merged.push_back(interval);\n        } else {\n            merged.back()[1] = max(merged.back()[1], interval[1]);\n        }\n    }\n    return merged;\n}'
    },
    solutionExplanation: 'Sort intervals by their start values. Maintain a merged list and extend the end time whenever consecutive intervals overlap.',
    expectedConcept: 'Interval Sorting & Greedy Interval Overlap Merging',
    hints: ['Sort intervals primarily by their start times.'],
    timeComplexityExpected: 'O(N log N)',
    spaceComplexityExpected: 'O(N)',
    acceptanceRate: 76
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    category: 'Stack',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    inputFormat: 's = "()[]{}"',
    outputFormat: 'true',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Valid bracket pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All pairs properly closed in correct order.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatching closing bracket.' }
    ],
    testCases: [
      { input: 's = "()[]{}"', expectedOutput: 'true', isHidden: false },
      { input: 's = "(]"', expectedOutput: 'false', isHidden: false }
    ],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def isValid(s: str) -> bool:\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your Java solution here\n        return false;\n    }\n}',
      cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your C++ solution here\n        return false;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (const c of s) {\n    if (c === "(" || c === "{" || c === "[") {\n      stack.push(c);\n    } else {\n      if (stack.pop() !== map[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}',
      python: 'def isValid(s: str) -> bool:\n    stack = []\n    mp = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in mp.values():\n            stack.append(c)\n        elif c in mp:\n            if not stack or stack.pop() != mp[c]:\n                return False\n    return len(stack) == 0',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\') stack.push(\')\');\n            else if (c == \'{\') stack.push(\'}\');\n            else if (c == \'[\') stack.push(\']\');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}',
      cpp: 'bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\') st.push(\')\');\n        else if (c == \'{\') st.push(\'}\');\n        else if (c == \'[\') st.push(\']\');\n        else if (st.empty() || st.top() != c) return false;\n        else st.pop();\n    }\n    return st.empty();\n}'
    },
    solutionExplanation: 'Push opening brackets to a stack; on encountering closing brackets, pop and verify the corresponding match.',
    expectedConcept: 'LIFO Stack for bracket matching',
    hints: ['Push expected counterpart or check against top of stack.'],
    timeComplexityExpected: 'O(N)',
    spaceComplexityExpected: 'O(N)',
    acceptanceRate: 91
  },
  {
    title: 'Generate Parentheses',
    slug: 'generate-parentheses',
    category: 'Recursion',
    difficulty: 'Medium',
    description: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    inputFormat: 'n = 3',
    outputFormat: '["((()))","(()())","(())()","()(())","()()()"]',
    constraints: ['1 <= n <= 8'],
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: 'All 5 valid combinations for 3 pairs.' }
    ],
    testCases: [
      { input: 'n = 3', expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function generateParenthesis(n) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def generateParenthesis(n: int):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public List<String> generateParenthesis(int n) {\n        // Write your Java solution here\n        return new ArrayList<>();\n    }\n}',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        // Write your C++ solution here\n        return {};\n    }\n};'
    },
    solutionCode: {
      javascript: 'function generateParenthesis(n) {\n  const result = [];\n  function backtrack(curr, openCount, closeCount) {\n    if (curr.length === 2 * n) {\n      result.push(curr);\n      return;\n    }\n    if (openCount < n) backtrack(curr + "(", openCount + 1, closeCount);\n    if (closeCount < openCount) backtrack(curr + ")", openCount, closeCount + 1);\n  }\n  backtrack("", 0, 0);\n  return result;\n}',
      python: 'def generateParenthesis(n: int):\n    res = []\n    def backtrack(curr, open_c, close_c):\n        if len(curr) == 2 * n:\n            res.append(curr)\n            return\n        if open_c < n:\n            backtrack(curr + "(", open_c + 1, close_c)\n        if close_c < open_c:\n            backtrack(curr + ")", open_c, close_c + 1)\n    backtrack("", 0, 0)\n    return res',
      java: 'class Solution {\n    public List<String> generateParenthesis(int n) {\n        List<String> res = new ArrayList<>();\n        backtrack(res, "", 0, 0, n);\n        return res;\n    }\n    private void backtrack(List<String> res, String cur, int open, int close, int max) {\n        if (cur.length() == max * 2) { res.add(cur); return; }\n        if (open < max) backtrack(res, cur + "(", open + 1, close, max);\n        if (close < open) backtrack(res, cur + ")", open, close + 1, max);\n    }\n}',
      cpp: 'void backtrack(vector<string>& res, string cur, int open, int close, int max) {\n    if (cur.length() == max * 2) { res.push_back(cur); return; }\n    if (open < max) backtrack(res, cur + "(", open + 1, close, max);\n    if (close < open) backtrack(res, cur + ")", open, close + 1, max);\n}\nvector<string> generateParenthesis(int n) {\n    vector<string> res;\n    backtrack(res, "", 0, 0, n);\n    return res;\n}'
    },
    solutionExplanation: 'Backtracking approach: keep track of open and closed parentheses counts and only recurse along valid branches.',
    expectedConcept: 'Backtracking with state constraints',
    hints: ['Only add an open parenthesis if open < n.', 'Only add a closing parenthesis if close < open.'],
    timeComplexityExpected: 'O(4^N / sqrt(N))',
    spaceComplexityExpected: 'O(N)',
    acceptanceRate: 78
  },
  {
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    category: 'Queue',
    difficulty: 'Easy',
    description: 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).',
    inputFormat: '["MyQueue", "push", "push", "peek", "pop", "empty"]',
    outputFormat: '[null, null, null, 1, 1, false]',
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    examples: [
      { input: 'MyQueue queue = new MyQueue(); queue.push(1); queue.push(2); queue.peek(); queue.pop(); queue.empty();', output: '[1, 1, false]', explanation: 'Queue behaves in FIFO manner.' }
    ],
    testCases: [
      { input: 'push(1), push(2), peek()', expectedOutput: '1', isHidden: false }
    ],
    starterCode: {
      javascript: 'class MyQueue {\n  constructor() {\n    // Initialize your data structures here\n  }\n  push(x) {\n    // Push element to queue\n  }\n  pop() {\n    // Removes element from in front of queue\n  }\n  peek() {\n    // Get the front element\n  }\n  empty() {\n    // Returns whether the queue is empty\n  }\n}',
      python: 'class MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass',
      java: 'class MyQueue {\n    public MyQueue() {\n    }\n    public void push(int x) {\n    }\n    public int pop() {\n        return 0;\n    }\n    public int peek() {\n        return 0;\n    }\n    public boolean empty() {\n        return false;\n    }\n}',
      cpp: 'class MyQueue {\npublic:\n    MyQueue() {\n    }\n    void push(int x) {\n    }\n    int pop() {\n        return 0;\n    }\n    int peek() {\n        return 0;\n    }\n    bool empty() {\n        return false;\n    }\n};'
    },
    solutionCode: {
      javascript: 'class MyQueue {\n  constructor() {\n    this.inStack = [];\n    this.outStack = [];\n  }\n  push(x) {\n    this.inStack.push(x);\n  }\n  pop() {\n    this.peek();\n    return this.outStack.pop();\n  }\n  peek() {\n    if (this.outStack.length === 0) {\n      while (this.inStack.length > 0) {\n        this.outStack.push(this.inStack.pop());\n      }\n    }\n    return this.outStack[this.outStack.length - 1];\n  }\n  empty() {\n    return this.inStack.length === 0 && this.outStack.length === 0;\n  }\n}',
      python: 'class MyQueue:\n    def __init__(self):\n        self.in_st = []\n        self.out_st = []\n    def push(self, x: int) -> None:\n        self.in_st.append(x)\n    def pop(self) -> int:\n        self.peek()\n        return self.out_st.pop()\n    def peek(self) -> int:\n        if not self.out_st:\n            while self.in_st:\n                self.out_st.append(self.in_st.pop())\n        return self.out_st[-1]\n    def empty(self) -> bool:\n        return not self.in_st and not self.out_st',
      java: 'class MyQueue {\n    Stack<Integer> in = new Stack<>();\n    Stack<Integer> out = new Stack<>();\n    public void push(int x) { in.push(x); }\n    public int pop() { peek(); return out.pop(); }\n    public int peek() {\n        if (out.isEmpty()) {\n            while (!in.isEmpty()) out.push(in.pop());\n        }\n        return out.peek();\n    }\n    public boolean empty() { return in.isEmpty() && out.isEmpty(); }\n}',
      cpp: 'class MyQueue {\n    stack<int> in, out;\npublic:\n    void push(int x) { in.push(x); }\n    int pop() { peek(); int val = out.top(); out.pop(); return val; }\n    int peek() {\n        if (out.empty()) {\n            while (!in.empty()) { out.push(in.top()); in.pop(); }\n        }\n        return out.top();\n    }\n    bool empty() { return in.empty() && out.empty(); }\n};'
    },
    solutionExplanation: 'Two stacks: elements are pushed to inStack and transferred to outStack only when popping/peeking and outStack is empty.',
    expectedConcept: 'Amortized O(1) Queue using Dual Stacks',
    hints: ['Transfer elements from inStack to outStack lazily only when outStack is empty.'],
    timeComplexityExpected: 'Amortized O(1)',
    spaceComplexityExpected: 'O(N)',
    acceptanceRate: 85
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    category: 'Linked List',
    difficulty: 'Easy',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    inputFormat: 'head = [1,2,3,4,5]',
    outputFormat: '[5,4,3,2,1]',
    constraints: ['The number of nodes in the list is in the range [0, 5000]', '-5000 <= Node.val <= 5000'],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed pointer direction.' }
    ],
    testCases: [
      { input: 'head = [1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false }
    ],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def reverseList(head):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your Java solution here\n        return null;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your C++ solution here\n        return nullptr;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}',
      python: 'def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode nxt = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nxt;\n        }\n        return prev;\n    }\n}',
      cpp: 'ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        ListNode *nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}'
    },
    solutionExplanation: 'Iterative 3-pointer reversal maintaining prev, curr, and next references in O(1) auxiliary space.',
    expectedConcept: 'Three-pointer iterative pointer reversal',
    hints: ['Keep track of prev, curr, and next node references.'],
    timeComplexityExpected: 'O(N)',
    spaceComplexityExpected: 'O(1)',
    acceptanceRate: 92
  },
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    category: 'Trees',
    difficulty: 'Easy',
    description: 'Given the `root` of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    inputFormat: 'root = [3,9,20,null,null,15,7]',
    outputFormat: '3',
    constraints: ['The number of nodes in the tree is in the range [0, 10^4]', '-100 <= Node.val <= 100'],
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'Root 3 -> 20 -> 7 has 3 levels.' }
    ],
    testCases: [
      { input: 'root = [3,9,20,null,null,15,7]', expectedOutput: '3', isHidden: false }
    ],
    starterCode: {
      javascript: 'function maxDepth(root) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def maxDepth(root):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your Java solution here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        // Write your C++ solution here\n        return 0;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}',
      python: 'def maxDepth(root):\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))',
      java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}',
      cpp: 'int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(maxDepth(root->left), maxDepth(root->right));\n}'
    },
    solutionExplanation: 'Recursive DFS calculating 1 + max(depth(left), depth(right)).',
    expectedConcept: 'DFS Tree Traversal & Recursion Depth',
    hints: ['The depth of a tree is 1 + max depth of its left and right subtrees.'],
    timeComplexityExpected: 'O(N)',
    spaceComplexityExpected: 'O(H) where H is tree height',
    acceptanceRate: 89
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    category: 'Graphs',
    difficulty: 'Medium',
    description: 'Given an `m x n` 2D binary grid `grid` which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    inputFormat: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
    outputFormat: '1',
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
    examples: [
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '3 separate disconnected land components.' }
    ],
    testCases: [
      { input: 'grid with 3 islands', expectedOutput: '3', isHidden: false }
    ],
    starterCode: {
      javascript: 'function numIslands(grid) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def numIslands(grid):\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your Java solution here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your C++ solution here\n        return 0;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function numIslands(grid) {\n  if (!grid || !grid.length) return 0;\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;\n    grid[r][c] = "0";\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] === "1") {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}',
      python: 'def numIslands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == "0":\n            return\n        grid[r][c] = "0"\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(r, c)\n    return count',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == \'1\') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    void dfs(char[][] grid, int r, int c) {\n        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] == \'0\') return;\n        grid[r][c] = \'0\';\n        dfs(grid, r+1, c); dfs(grid, r-1, c); dfs(grid, r, c+1); dfs(grid, r, c-1);\n    }\n}',
      cpp: 'void dfs(vector<vector<char>>& grid, int r, int c) {\n    if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] == \'0\') return;\n    grid[r][c] = \'0\';\n    dfs(grid, r + 1, c); dfs(grid, r - 1, c); dfs(grid, r, c + 1); dfs(grid, r, c - 1);\n}\nint numIslands(vector<vector<char>>& grid) {\n    int count = 0;\n    for (int r = 0; r < grid.size(); ++r) {\n        for (int c = 0; c < grid[0].size(); ++c) {\n            if (grid[r][c] == \'1\') { count++; dfs(grid, r, c); }\n        }\n    }\n    return count;\n}'
    },
    solutionExplanation: 'Flood fill via DFS: when hitting land, increment island count and recursively sink all 4-directionally adjacent lands to 0.',
    expectedConcept: 'Connected Components via DFS / BFS Graph flood fill',
    hints: ['Sink the island by marking visited land as "0" to prevent infinite loops.'],
    timeComplexityExpected: 'O(M * N)',
    spaceComplexityExpected: 'O(M * N)',
    acceptanceRate: 72
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    inputFormat: 'n = 3',
    outputFormat: '3',
    constraints: ['1 <= n <= 45'],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1 (3 distinct ways).' }
    ],
    testCases: [
      { input: 'n = 2', expectedOutput: '2', isHidden: false },
      { input: 'n = 3', expectedOutput: '3', isHidden: false },
      { input: 'n = 5', expectedOutput: '8', isHidden: true }
    ],
    starterCode: {
      javascript: 'function climbStairs(n) {\n  // Write your JavaScript solution here\n  \n}',
      python: 'def climbStairs(n: int) -> int:\n    # Write your Python solution here\n    pass',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your Java solution here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your C++ solution here\n        return 0;\n    }\n};'
    },
    solutionCode: {
      javascript: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}',
      python: 'def climbStairs(n: int) -> int:\n    if n <= 2:\n        return n\n    p2, p1 = 1, 2\n    for _ in range(3, n + 1):\n        p2, p1 = p1, p1 + p2\n    return p1',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int p2 = 1, p1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int cur = p1 + p2;\n            p2 = p1;\n            p1 = cur;\n        }\n        return p1;\n    }\n}',
      cpp: 'int climbStairs(int n) {\n    if (n <= 2) return n;\n    int p2 = 1, p1 = 2;\n    for (int i = 3; i <= n; ++i) {\n        int cur = p1 + p2;\n        p2 = p1;\n        p1 = cur;\n    }\n    return p1;\n}'
    },
    solutionExplanation: 'Fibonacci state transition dp[i] = dp[i-1] + dp[i-2], optimized to O(1) space using two rolling variables.',
    expectedConcept: 'Fibonacci Dynamic Programming with O(1) space optimization',
    hints: ['To reach step n, you must arrive from either step n-1 or step n-2.'],
    timeComplexityExpected: 'O(N)',
    spaceComplexityExpected: 'O(1)',
    acceptanceRate: 94
  }
];


const sampleJobs = [
  {
    title: 'Full Stack Engineer (MERN / Next.js)',
    company: 'Atlassian Cloud Innovations',
    location: 'Bengaluru, Karnataka (Hybrid)',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹14,00,000 - ₹20,00,000 / year',
    requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST API'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'Redis', 'Jest'],
    description: 'We are seeking an ambitious Junior/Graduate Full-Stack Engineer to architect collaborative cloud microservices, optimize high-throughput React interfaces, and design resilient REST APIs.',
    responsibilities: [
      'Build performant and accessible web components in React and modern CSS.',
      'Develop scalable RESTful and event-driven backend services with Node.js and MongoDB.',
      'Participate in agile sprints, code reviews, and automated CI/CD deployments.'
    ],
    benefits: ['Comprehensive Health Insurance', 'Generous Learning Stipend', 'Remote Work Flexibility', 'Stock Options (RSUs)'],
    applicationUrl: 'https://www.atlassian.com/company/careers'
  },
  {
    title: 'Associate Software Engineer — Frontend',
    company: 'Razorpay Payments',
    location: 'Bengaluru, Karnataka',
    experienceLevel: '0-1 Years',
    employmentType: 'Full-time',
    salary: '₹12,00,000 - ₹16,00,000 / year',
    requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST API'],
    preferredSkills: ['Redux Toolkit', 'TailwindCSS', 'Web Performance Optimization', 'Figma'],
    description: 'Join India’s leading fintech infrastructure powering millions of business transactions. Build responsive merchant dashboards and checkout SDKs.',
    responsibilities: [
      'Develop high-conversion, pixel-perfect checkout and dashboard flows.',
      'Optimize bundle size, Core Web Vitals, and runtime memory efficiency.',
      'Collaborate with product designers and backend engineers.'
    ],
    benefits: ['Wellness Allowances', 'Annual Learning Budget', 'Flexible Hours'],
    applicationUrl: 'https://razorpay.com/jobs'
  },
  {
    title: 'Backend Systems Developer (Node.js / Distributed Systems)',
    company: 'Swiggy Delivery Platform',
    location: 'Hyderabad / Bengaluru (Hybrid)',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹15,00,000 - ₹22,00,000 / year',
    requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Data Structures', 'REST API'],
    preferredSkills: ['Kafka', 'Redis', 'Docker', 'Kubernetes', 'Microservices'],
    description: 'Help build ultra-low-latency order tracking and dispatching systems handling millions of orders per day.',
    responsibilities: [
      'Design high-throughput APIs and async message consumers.',
      'Optimize database queries, indexing strategies, and caching layers.',
      'Monitor distributed services with Prometheus and Grafana.'
    ],
    benefits: ['Free Meals & Swiggy One VIP', 'ESOPs', 'Health Coverage'],
    applicationUrl: 'https://careers.swiggy.com'
  },
  {
    title: 'AI / ML Engineer Trainee',
    company: 'Microsoft India R&D',
    location: 'Hyderabad, Telangana',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹18,00,000 - ₹26,00,000 / year',
    requiredSkills: ['Python', 'Machine Learning', 'Data Structures', 'PyTorch', 'SQL'],
    preferredSkills: ['LangChain', 'OpenAI / Gemini APIs', 'Docker', 'FastAPI'],
    description: 'Work with the Azure AI engineering group to develop generative AI copilots, retrieval augmented generation (RAG) pipelines, and intelligent NLP services.',
    responsibilities: [
      'Fine-tune embeddings and train domain-specific models.',
      'Deploy inference endpoints with low latency SLA.',
      'Benchmark model hallucination, accuracy, and safety.'
    ],
    benefits: ['Relocation Support', 'Parental Leave', 'Education Subsidy'],
    applicationUrl: 'https://careers.microsoft.com'
  },
  {
    title: 'Java Cloud Backend Developer',
    company: 'Morgan Stanley Global Tech',
    location: 'Mumbai / Bengaluru',
    experienceLevel: '0-1 Years',
    employmentType: 'Full-time',
    salary: '₹13,00,000 - ₹18,00,000 / year',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Data Structures', 'Git', 'REST API'],
    preferredSkills: ['Hibernate', 'Docker', 'Microservices', 'Kafka'],
    description: 'Design enterprise financial transaction systems, automated settlement engines, and risk management pipelines.',
    responsibilities: [
      'Write clean, modular Java 17+ code with Spring Boot.',
      'Maintain ACID transactional consistency across distributed databases.',
      'Implement unit and integration testing with JUnit and Mockito.'
    ],
    benefits: ['Performance Bonus', 'Global Rotation Programs', 'Medical Plan'],
    applicationUrl: 'https://morganstanley.com/careers'
  },
  {
    title: 'Cloud & DevOps Associate',
    company: 'Cisco Systems',
    location: 'Bengaluru, Karnataka',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹11,00,000 - ₹15,00,000 / year',
    requiredSkills: ['Linux', 'Git', 'Docker', 'Python', 'Networking Basics'],
    preferredSkills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD Pipelines'],
    description: 'Automate build, deployment, and infrastructure orchestration for enterprise networking platforms.',
    responsibilities: [
      'Create reproducible Docker images and Helm charts.',
      'Automate GitHub Actions workflows and canary deployments.',
      'Ensure security compliance and secret management.'
    ],
    benefits: ['Tuition Reimbursement', 'Gym Membership', 'Transport Facilities'],
    applicationUrl: 'https://jobs.cisco.com'
  },
  {
    title: 'Junior Data Analyst',
    company: 'Zomato Analytics',
    location: 'Gurugram / Remote',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹9,00,000 - ₹13,00,000 / year',
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics'],
    preferredSkills: ['Tableau', 'PowerBI', 'Pandas', 'A/B Testing'],
    description: 'Transform user behavior logs into actionable product insights and restaurant partner growth strategies.',
    responsibilities: [
      'Write complex SQL queries, aggregations, and window functions.',
      'Build automated dashboards for leadership and city operations teams.',
      'Conduct cohort analysis and customer retention metrics.'
    ],
    benefits: ['Daily Meal Allowance', 'Health Benefits', 'Flexible Leave Policy'],
    applicationUrl: 'https://zomato.com/careers'
  },
  {
    title: 'Graduate Engineer Trainee (GET 2026)',
    company: 'Infosys Springboard Digital',
    location: 'Pan India (Multiple Locations)',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹6,50,000 - ₹9,50,000 / year',
    requiredSkills: ['C++', 'Java', 'Python', 'Data Structures', 'SQL', 'Problem Solving'],
    preferredSkills: ['Cloud Basics', 'HTML/CSS/JS', 'Agile Fundamentals'],
    description: 'Kickstart your technology career through our elite digital specialist training program with industry live projects.',
    responsibilities: [
      'Participate in foundational enterprise software engineering training.',
      'Develop web and database modules under senior architect guidance.'
    ],
    benefits: ['Structured Career Growth', 'Certifications Support', 'Campus Amenities'],
    applicationUrl: 'https://infosys.com/careers'
  },
  {
    title: 'Product Designer (UI/UX)',
    company: 'Canva Create Studios',
    location: 'Bengaluru / Remote',
    experienceLevel: 'Fresher',
    employmentType: 'Full-time',
    salary: '₹10,00,000 - ₹14,00,000 / year',
    requiredSkills: ['Figma', 'UI Design', 'Wireframing', 'User Research', 'Prototyping'],
    preferredSkills: ['Design Systems', 'HTML/CSS Understanding', 'Micro-interactions'],
    description: 'Craft intuitive, accessible visual interfaces and motion designs that empower millions of creative creators globally.',
    responsibilities: [
      'Design comprehensive Figma wireframes, mockups, and clickable prototypes.',
      'Maintain design system tokens and component consistency.',
      'Conduct usability interviews and validate user workflows.'
    ],
    benefits: ['Latest MacBook Pro', 'Design Conference Passes', 'Wellness Budget'],
    applicationUrl: 'https://canva.com/careers'
  },
  {
    title: 'Full Stack Web Developer (Intern to Hire)',
    company: 'Zepto Quick Commerce',
    location: 'Mumbai / Bengaluru',
    experienceLevel: 'Fresher',
    employmentType: 'Internship',
    salary: '₹40,000 - ₹60,000 / month (PPO up to ₹16 LPA)',
    requiredSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'],
    preferredSkills: ['Next.js', 'TailwindCSS', 'WebSockets'],
    description: 'Work directly with founders and principal engineers to innovate 10-minute grocery delivery rider and customer web portals.',
    responsibilities: [
      'Implement lightning-fast frontend pages and order tracking interfaces.',
      'Integrate payment gateway webhooks and SMS/Push notifications.'
    ],
    benefits: ['High PPO Conversion Rate', 'Free Snacks & Energy Drinks', 'Direct Mentorship'],
    applicationUrl: 'https://zepto.com/careers'
  }
];

const sampleLearningResources = [
  {
    title: 'Full Stack Open — Deep Dive Into Modern Web Development',
    category: 'Full Stack Development',
    skillTags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'TypeScript'],
    type: 'Course',
    url: 'https://fullstackopen.com/en/',
    provider: 'University of Helsinki',
    difficulty: 'Intermediate',
    estimatedDuration: '40-60 hours',
    isFree: true,
    rating: 4.9
  },
  {
    title: 'MDN Web Docs — JavaScript Intermediate to Advanced Guide',
    category: 'Frontend Development',
    skillTags: ['JavaScript', 'HTML5', 'CSS3', 'Async JS', 'DOM'],
    type: 'Documentation',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    provider: 'Mozilla Developer Network',
    difficulty: 'Beginner',
    estimatedDuration: '15-20 hours',
    isFree: true,
    rating: 5.0
  },
  {
    title: 'Node.js REST API Best Practices & Security Guide',
    category: 'Backend Development',
    skillTags: ['Node.js', 'Express.js', 'REST API', 'JWT', 'Security'],
    type: 'Article',
    url: 'https://expressjs.com/en/guide/routing.html',
    provider: 'Express.js Community',
    difficulty: 'Intermediate',
    estimatedDuration: '8-10 hours',
    isFree: true,
    rating: 4.8
  },
  {
    title: 'MongoDB University — M001: MongoDB Basics & Aggregation Pipelines',
    category: 'Database Management',
    skillTags: ['MongoDB', 'NoSQL', 'Database Indexing', 'Aggregation'],
    type: 'Course',
    url: 'https://learn.mongodb.com/',
    provider: 'MongoDB Inc.',
    difficulty: 'Beginner',
    estimatedDuration: '12-15 hours',
    isFree: true,
    rating: 4.9
  },
  {
    title: 'Docker & Containerization for Modern Developers — Crash Course',
    category: 'DevOps & Cloud',
    skillTags: ['Docker', 'DevOps', 'Containers', 'CI/CD'],
    type: 'Video',
    url: 'https://www.docker.com/101-tutorial/',
    provider: 'Docker Official',
    difficulty: 'Beginner',
    estimatedDuration: '4-6 hours',
    isFree: true,
    rating: 4.7
  },
  {
    title: 'NeetCode 150 — Data Structures & Algorithms Mastery',
    category: 'Coding & DSA',
    skillTags: ['Data Structures', 'Algorithms', 'Arrays', 'Trees', 'Dynamic Programming'],
    type: 'Interactive',
    url: 'https://neetcode.io/practice',
    provider: 'NeetCode',
    difficulty: 'Intermediate',
    estimatedDuration: '80-100 hours',
    isFree: true,
    rating: 5.0
  },
  {
    title: 'System Design Primer — Scalable Architecture Fundamentals',
    category: 'System Design',
    skillTags: ['System Design', 'Microservices', 'Caching', 'Load Balancing'],
    type: 'Documentation',
    url: 'https://github.com/donnemartin/system-design-primer',
    provider: 'GitHub Open Source',
    difficulty: 'Advanced',
    estimatedDuration: '30-40 hours',
    isFree: true,
    rating: 4.9
  },
  {
    title: 'Technical & Behavioral Interview Blueprint (STAR Method)',
    category: 'Interview Preparation',
    skillTags: ['Interview Prep', 'Communication', 'STAR Technique', 'HR Questions'],
    type: 'CheatSheet',
    url: 'https://www.themuse.com/advice/star-interview-method',
    provider: 'CareerPilot AI Research',
    difficulty: 'Beginner',
    estimatedDuration: '3-5 hours',
    isFree: true,
    rating: 4.8
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerpilot';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected for database seeding...');

    // Clear existing collections
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await CodingQuestion.deleteMany({});
    await Job.deleteMany({});
    await LearningResource.deleteMany({});
    await CareerGoal.deleteMany({});
    await LearningRoadmap.deleteMany({});
    await Notification.deleteMany({});
    await Resume.deleteMany({});
    await Assessment.deleteMany({});
    await Interview.deleteMany({});

    // Seed Demo Student
    console.log('Seeding Demo Student & Placement Admin...');
    const demoStudent = await User.create({
      name: 'Aarav Sharma',
      email: 'student.demo@careerpilot.ai',
      password: 'Password@123',
      role: 'student',
      phone: '+91 98765 43210',
      location: 'Bengaluru, Karnataka',
      bio: 'B.Tech CSE final year student passionate about Full-Stack Development, Distributed Systems, and AI-assisted cloud tools.',
      education: {
        college: 'Indian Institute of Information Technology (IIIT)',
        degree: 'B.Tech',
        department: 'Computer Science and Engineering',
        graduationYear: 2026,
        cgpa: '8.85'
      },
      skills: {
        languages: ['JavaScript', 'TypeScript', 'Python', 'C++', 'SQL'],
        frameworks: ['React.js', 'Node.js', 'Express.js', 'HTML5', 'CSS3'],
        databases: ['MongoDB', 'PostgreSQL', 'Redis'],
        tools: ['Git', 'Docker', 'Postman', 'Vercel', 'AWS S3'],
        softSkills: ['Analytical Thinking', 'Problem Solving', 'Agile Collaboration', 'Technical Presentation']
      },
      careerPreferences: {
        targetRole: 'Full Stack Developer',
        preferredTech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Docker'],
        preferredLocation: 'Bengaluru / Hyderabad / Remote',
        preferredEmploymentType: 'Full-time',
        expectedSalary: '₹12,00,000 - ₹18,00,000 / year'
      },
      projects: [
        {
          title: 'SkillSwap — Peer Mentorship & Code Review Platform',
          description: 'Full-stack collaborative portal featuring real-time socket sessions, markdown whiteboard, and JWT authentication.',
          technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io'],
          githubUrl: 'https://github.com/aaravsharma/skillswap',
          liveUrl: 'https://skillswap-demo.vercel.app',
          featured: true
        },
        {
          title: 'DevPulse — Developer Productivity & GitHub Metrics Visualizer',
          description: 'Analyzes commit frequency, code complexity, and PR velocity with interactive chart visualizations.',
          technologies: ['React', 'Chart.js', 'Express', 'GitHub REST API'],
          githubUrl: 'https://github.com/aaravsharma/devpulse',
          liveUrl: 'https://devpulse.vercel.app',
          featured: true
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          date: 'Jan 2025',
          url: 'https://aws.amazon.com/certification'
        },
        {
          name: 'Meta Front-End Developer Specialization',
          issuer: 'Coursera / Meta',
          date: 'Nov 2024',
          url: 'https://coursera.org'
        }
      ],
      readinessScore: {
        overall: 78,
        resume: 82,
        skills: 75,
        coding: 72,
        interview: 80,
        projects: 85,
        history: [
          { date: new Date('2026-06-01'), score: 54 },
          { date: new Date('2026-07-01'), score: 65 },
          { date: new Date('2026-08-01'), score: 78 }
        ],
        lastCalculated: new Date()
      }
    });

    // Seed Admin
    const demoAdmin = await User.create({
      name: 'Dr. Priya Ramesh',
      email: 'admin@careerpilot.ai',
      password: 'AdminPassword@123',
      role: 'admin',
      phone: '+91 91234 56789',
      location: 'Placement & Training Directorate',
      bio: 'Head of Career Guidance & Corporate Relations. Overseeing campus placements and talent benchmarking.',
      education: {
        college: 'IIT Madras',
        degree: 'Ph.D. in Computer Science',
        department: 'Academic & Placement Division',
        graduationYear: 2012
      }
    });

    // Seed Additional Peer Students for Admin Analytics
    await User.create([
      {
        name: 'Sneha Patel',
        email: 'sneha.patel@careerpilot.ai',
        password: 'Password@123',
        role: 'student',
        education: { college: 'IIIT', degree: 'B.Tech', department: 'Information Technology', graduationYear: 2026, cgpa: '9.1' },
        skills: { languages: ['Python', 'SQL'], frameworks: ['Django', 'FastAPI'], databases: ['PostgreSQL'], tools: ['Docker'], softSkills: ['Leadership'] },
        careerPreferences: { targetRole: 'AI/ML Engineer' },
        readinessScore: { overall: 84, resume: 88, skills: 82, coding: 85, interview: 80, projects: 85 }
      },
      {
        name: 'Rohit Verma',
        email: 'rohit.verma@careerpilot.ai',
        password: 'Password@123',
        role: 'student',
        education: { college: 'NIT Trichy', degree: 'B.Tech', department: 'Computer Science', graduationYear: 2026, cgpa: '7.8' },
        skills: { languages: ['Java', 'C++'], frameworks: ['Spring Boot'], databases: ['MySQL'], tools: ['Git'], softSkills: ['Teamwork'] },
        careerPreferences: { targetRole: 'Java Developer' },
        readinessScore: { overall: 65, resume: 70, skills: 60, coding: 70, interview: 60, projects: 65 }
      },
      {
        name: 'Ananya Sen',
        email: 'ananya.sen@careerpilot.ai',
        password: 'Password@123',
        role: 'student',
        education: { college: 'BITS Pilani', degree: 'B.Tech', department: 'Electronics & CS', graduationYear: 2026, cgpa: '8.4' },
        skills: { languages: ['JavaScript', 'HTML5', 'CSS3'], frameworks: ['React', 'Vue.js'], databases: ['MongoDB'], tools: ['Figma'], softSkills: ['Communication'] },
        careerPreferences: { targetRole: 'Frontend Developer' },
        readinessScore: { overall: 72, resume: 78, skills: 75, coding: 65, interview: 70, projects: 75 }
      }
    ]);

    // Seed Coding Questions
    console.log('Seeding coding questions...');
    await CodingQuestion.insertMany(sampleCodingQuestions);

    // Seed Jobs
    console.log('Seeding job listings...');
    const jobsToInsert = sampleJobs.map(job => ({
      ...job,
      postedBy: demoAdmin._id
    }));
    await Job.insertMany(jobsToInsert);

    // Seed Learning Resources
    console.log('Seeding learning resources...');
    await LearningResource.insertMany(sampleLearningResources);

    // Seed Career Goal for Demo Student
    console.log('Seeding Career Goal and Roadmap for Demo Student...');
    await CareerGoal.create({
      userId: demoStudent._id,
      targetRole: 'Full Stack Developer',
      targetIndustry: 'Software & Cloud SaaS',
      targetTimelineMonths: 6,
      requiredSkills: [
        { name: 'HTML5 / CSS3', category: 'Frontend', importance: 'Critical' },
        { name: 'JavaScript (ES6+)', category: 'Frontend', importance: 'Critical' },
        { name: 'React.js', category: 'Frontend', importance: 'Critical' },
        { name: 'Node.js', category: 'Backend', importance: 'Critical' },
        { name: 'Express.js', category: 'Backend', importance: 'Critical' },
        { name: 'MongoDB', category: 'Database', importance: 'Critical' },
        { name: 'REST APIs', category: 'Backend', importance: 'Critical' },
        { name: 'Git & Version Control', category: 'DevOps', importance: 'Critical' },
        { name: 'Docker & Containers', category: 'DevOps', importance: 'High' },
        { name: 'Redis Caching', category: 'Database', importance: 'Medium' },
        { name: 'System Design Basics', category: 'Architecture', importance: 'High' }
      ],
      acquiredSkills: ['HTML5 / CSS3', 'JavaScript (ES6+)', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Git & Version Control'],
      missingSkills: ['REST APIs', 'Docker & Containers', 'Redis Caching', 'System Design Basics'],
      matchPercentage: 73,
      readinessLevel: 'Intermediate'
    });

    // Seed Learning Roadmap for Demo Student
    await LearningRoadmap.create({
      userId: demoStudent._id,
      targetRole: 'Full Stack Developer',
      title: 'MERN Full Stack Developer Placement Pathway',
      overview: 'Structured mastery roadmap focusing on backend architecture, API resilience, and containerized deployment.',
      topics: [
        {
          topicId: 't1',
          title: 'Advanced JavaScript & Async Patterns',
          description: 'Master event loop, closures, promises, async/await, and memory management in V8.',
          category: 'Frontend / Core',
          difficulty: 'Intermediate',
          estimatedHours: 12,
          monthPhase: 'Month 1',
          phaseOrder: 1,
          prerequisites: ['Basic JavaScript'],
          keyConcepts: ['Event Loop', 'Closures', 'Promise.allSettled', 'Microtasks'],
          projectIdea: {
            title: 'Custom Promise Polyfill & Async Queue',
            description: 'Implement a promise library from scratch to master async execution.'
          },
          recommendedResources: [
            { title: 'MDN JavaScript Guide', type: 'Documentation', url: 'https://developer.mozilla.org', provider: 'MDN', isFree: true }
          ],
          status: 'Completed',
          completedAt: new Date('2026-07-15')
        },
        {
          topicId: 't2',
          title: 'REST API Design & Secure JWT Architecture',
          description: 'Architect modular Express routers, robust controller layers, JWT refresh token flows, and rate limiting.',
          category: 'Backend',
          difficulty: 'Intermediate',
          estimatedHours: 15,
          monthPhase: 'Month 2',
          phaseOrder: 2,
          prerequisites: ['Node.js Basics'],
          keyConcepts: ['REST Principles', 'JWT Tokens', 'Bcrypt Hashing', 'Input Validation'],
          projectIdea: {
            title: 'Multi-Tenant Auth API Service',
            description: 'Build a secure auth microservice supporting role-based access control (RBAC).'
          },
          recommendedResources: [
            { title: 'Full Stack Open Part 4', type: 'Course', url: 'https://fullstackopen.com', provider: 'Univ of Helsinki', isFree: true }
          ],
          status: 'In Progress'
        },
        {
          topicId: 't3',
          title: 'MongoDB Indexing & Aggregation Pipelines',
          description: 'Compound indexes, execution stats analysis ($explain), and complex multi-stage pipeline transformations.',
          category: 'Database',
          difficulty: 'Intermediate',
          estimatedHours: 10,
          monthPhase: 'Month 3',
          phaseOrder: 3,
          prerequisites: ['Basic Mongo CRUD'],
          keyConcepts: ['B-Tree Indexes', '$match', '$group', '$lookup', '$unwind'],
          status: 'Not Started'
        },
        {
          topicId: 't4',
          title: 'Docker Containerization & CI/CD Pipelines',
          description: 'Create multi-stage Dockerfiles for client and server, optimize container image sizes, and deploy via GitHub Actions.',
          category: 'DevOps',
          difficulty: 'Advanced',
          estimatedHours: 14,
          monthPhase: 'Month 4',
          phaseOrder: 4,
          prerequisites: ['Linux Basics'],
          keyConcepts: ['Dockerfile', 'Docker Compose', 'GitHub Actions', 'Environment Secrets'],
          status: 'Not Started'
        }
      ],
      totalTopics: 4,
      completedTopics: 1,
      progressPercentage: 25,
      aiRecommendation: {
        currentFocus: 'REST API Design & Secure JWT Architecture',
        reasoning: 'Your frontend React foundation is solid (85% score), but industry recruiters look for proven backend API design and middleware experience.',
        nextAction: 'Complete the REST API practice module and review rate-limiting middleware patterns.'
      }
    });

    // Seed In-App Notifications for Demo Student
    await Notification.create([
      {
        userId: demoStudent._id,
        title: 'New High Match Job Available!',
        message: 'Atlassian posted "Full Stack Engineer (MERN)" with an 89% skill match to your profile.',
        type: 'job_alert',
        link: '/jobs',
        isRead: false
      },
      {
        userId: demoStudent._id,
        title: 'Resume ATS Analysis Complete',
        message: 'Your resume received an ATS score of 82/100. Review 3 suggestions to improve backend keywords.',
        type: 'resume_analysis',
        link: '/resume',
        isRead: false
      },
      {
        userId: demoStudent._id,
        title: 'Weekly Learning Goal Reminder',
        message: 'You have 1 active topic in progress: "REST API Design & Secure JWT Architecture". Keep up the great momentum!',
        type: 'learning_reminder',
        link: '/roadmap',
        isRead: true
      }
    ]);

    // Seed Sample Resume for Demo Student
    await Resume.create({
      userId: demoStudent._id,
      fileName: 'Aarav_Sharma_FullStack_Resume.pdf',
      fileUrl: '/uploads/sample_resume.pdf',
      fileSize: 142800,
      extractedText: 'Aarav Sharma | B.Tech Computer Science | Skills: React, Node.js, Express, MongoDB, JavaScript, Python, C++, Docker, Git | Projects: SkillSwap MERN platform, DevPulse GitHub analytics...',
      parsedData: {
        name: 'Aarav Sharma',
        email: 'student.demo@careerpilot.ai',
        phone: '+91 98765 43210',
        education: ['B.Tech in Computer Science and Engineering, IIIT (2022-2026) — CGPA 8.85'],
        skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Python', 'C++', 'Git', 'Docker', 'REST API'],
        projects: ['SkillSwap — Peer Mentorship Platform', 'DevPulse — GitHub Metrics Visualizer'],
        experience: ['Software Engineering Intern at TechLabs (Summer 2025)'],
        certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Specialization'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
        achievements: ['Ranked Top 5% in National Coding Olympiad', 'Dean’s Honor List for Academic Excellence']
      },
      analysis: {
        overallScore: 82,
        breakdown: {
          skillsScore: 85,
          projectsScore: 88,
          educationScore: 90,
          experienceScore: 75,
          achievementsScore: 80,
          formattingScore: 85,
          jobRelevanceScore: 82
        },
        strengths: [
          'Strong full-stack MERN portfolio with live deployed demo URLs',
          'Solid foundational computer science GPA (8.85) from an accredited institute',
          'Industry-standard cloud certification (AWS Cloud Practitioner)'
        ],
        weaknesses: [
          'Limited quantifiable business impact metrics in project descriptions (e.g. % performance increase)',
          'Could highlight CI/CD and automated testing tools (Jest, Cypress, GitHub Actions)'
        ],
        suggestions: [
          'Add measurable numbers to projects, e.g. "Reduced API latency by 35% through Redis caching"',
          'Include a dedicated section for unit testing and CI/CD pipelines',
          'Expand on system design and database indexing techniques'
        ],
        keywordGaps: ['Docker Compose', 'Redis', 'Jest', 'CI/CD', 'GraphQL'],
        targetRoleMatch: {
          role: 'Full Stack Developer',
          matchScore: 84,
          matchedKeywords: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'JavaScript', 'Git'],
          missingKeywords: ['Redis', 'Docker Compose', 'Unit Testing']
        }
      },
      isCurrent: true
    });

    console.log('✅ Database seeded successfully with realistic demonstration data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const qCount = await CodingQuestion.countDocuments();
    if (qCount === 0) {
      console.log('📌 Auto-seeding default Coding Questions...');
      await CodingQuestion.insertMany(sampleCodingQuestions);
    } else {
      const sampleQ = await CodingQuestion.findOne({ slug: 'two-sum' });
      if (!sampleQ || !sampleQ.solutionCode || !sampleQ.solutionCode.javascript) {
        console.log('📌 Synchronizing Coding Questions with clean starter templates and solution codes...');
        await CodingQuestion.deleteMany({});
        await CodingQuestion.insertMany(sampleCodingQuestions);
      }
    }
    const jCount = await Job.countDocuments();
    if (jCount === 0) {
      console.log('📌 Auto-seeding default Placement Jobs...');
      await Job.insertMany(sampleJobs);
    }
    const rCount = await LearningResource.countDocuments();
    if (rCount === 0) {
      console.log('📌 Auto-seeding default Learning Resources...');
      await LearningResource.insertMany(sampleLearningResources);
    }
  } catch (err) {
    console.warn('Auto-seed check notice:', err.message);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, autoSeedIfEmpty, sampleCodingQuestions, sampleJobs, sampleLearningResources };


