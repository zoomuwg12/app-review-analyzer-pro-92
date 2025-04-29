
import { AspectCategory } from './types';
import { getSentiment } from './sentiment';

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
