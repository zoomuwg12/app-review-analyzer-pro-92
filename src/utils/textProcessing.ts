
export interface ProcessedReview {
  original: string;
  processed: string;
  sentences: string[];
  words: string[];
  wordCount: number;
  uniqueWords: string[];
  uniqueWordCount: number;
}

// Common English stop words
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

export function preprocessText(text: string, options: {
  lowercase?: boolean;
  removeStopWords?: boolean;
  removeNumbers?: boolean;
  removePunctuation?: boolean;
  removeTags?: boolean;
} = {}): ProcessedReview {
  const {
    lowercase = true,
    removeStopWords = true,
    removeNumbers = false,
    removePunctuation = true,
    removeTags = true
  } = options;

  let processedText = text;

  // Lowercase the text
  if (lowercase) {
    processedText = processedText.toLowerCase();
  }

  // Remove HTML tags
  if (removeTags) {
    processedText = processedText.replace(/<[^>]*>/g, ' ');
  }

  // Remove URLs
  processedText = processedText.replace(/https?:\/\/\S+/g, ' ');

  // Remove numbers
  if (removeNumbers) {
    processedText = processedText.replace(/\d+/g, ' ');
  }

  // Remove punctuation
  if (removePunctuation) {
    processedText = processedText.replace(/[^\w\s]|_/g, ' ');
  }

  // Split into sentences
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  
  // Split into words
  const words = processedText.split(/\s+/).filter(w => w.length > 0);
  
  let filteredWords = words;
  // Remove stop words
  if (removeStopWords) {
    filteredWords = words.filter(word => !STOP_WORDS.has(word));
  }

  // Count words
  const wordCount = filteredWords.length;

  // Get unique words
  const uniqueWords = [...new Set(filteredWords)];
  const uniqueWordCount = uniqueWords.length;

  return {
    original: text,
    processed: filteredWords.join(' '),
    sentences,
    words: filteredWords,
    wordCount,
    uniqueWords,
    uniqueWordCount
  };
}

export function getSentiment(score: number): 'positive' | 'neutral' | 'negative' {
  if (score >= 4) return 'positive';
  if (score >= 3) return 'neutral';
  return 'negative';
}

export interface KeywordFrequency {
  word: string;
  count: number;
}

export function getKeywordFrequencies(texts: string[], topN: number = 10): KeywordFrequency[] {
  const wordFreq: Record<string, number> = {};
  
  texts.forEach(text => {
    const processed = preprocessText(text);
    processed.words.forEach(word => {
      if (word.length < 2) return; // Skip very short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  });
  
  return Object.entries(wordFreq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

export interface AspectCategory {
  name: string;
  keywords: string[];
}

// Predefined aspect categories for apps
export const APP_ASPECTS: AspectCategory[] = [
  {
    name: "Performance",
    keywords: ["performance", "speed", "fast", "slow", "lag", "crash", "loading", "freeze", "hang", "responsive", "optimization"]
  },
  {
    name: "UI/Interface",
    keywords: ["interface", "ui", "design", "layout", "look", "appearance", "theme", "color", "button", "screen", "display"]
  },
  {
    name: "Usability",
    keywords: ["usability", "user-friendly", "intuitive", "easy", "difficult", "confusing", "complicated", "simple", "clear", "straightforward"]
  },
  {
    name: "Features",
    keywords: ["feature", "functionality", "option", "capability", "tool", "function", "ability", "control", "setting"]
  },
  {
    name: "Reliability",
    keywords: ["reliable", "stability", "stable", "consistent", "dependable", "trustworthy", "solid", "robust", "glitch", "bug", "error"]
  },
  {
    name: "Security",
    keywords: ["security", "secure", "privacy", "protection", "safe", "confidential", "private", "login", "password", "authentication"]
  },
  {
    name: "Customer Service",
    keywords: ["support", "service", "help", "assistance", "contact", "response", "customer service", "feedback", "reply", "answer"]
  },
  {
    name: "Update",
    keywords: ["update", "upgrade", "version", "latest", "new", "improved", "improvement", "fix", "fixed", "recent", "change"]
  },
  {
    name: "Transaction",
    keywords: ["transaction", "payment", "purchase", "buy", "money", "cost", "price", "fee", "charge", "subscription", "pay"]
  }
];

export function categorizeReviewByAspect(review: string): string[] {
  const lowerCaseReview = review.toLowerCase();
  return APP_ASPECTS
    .filter(aspect => aspect.keywords.some(keyword => lowerCaseReview.includes(keyword)))
    .map(aspect => aspect.name);
}

export function getAspectSentiments(reviews: { content: string; score: number }[]): Record<string, { positive: number; neutral: number; negative: number; total: number }> {
  const aspects: Record<string, { positive: number; neutral: number; negative: number; total: number }> = {};

  // Initialize aspects
  APP_ASPECTS.forEach(aspect => {
    aspects[aspect.name] = { positive: 0, neutral: 0, negative: 0, total: 0 };
  });

  reviews.forEach(review => {
    const reviewAspects = categorizeReviewByAspect(review.content);
    const sentiment = getSentiment(review.score);

    reviewAspects.forEach(aspect => {
      aspects[aspect][sentiment]++;
      aspects[aspect].total++;
    });
  });

  return aspects;
}
