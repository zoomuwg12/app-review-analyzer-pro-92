
export function getSentiment(score: number): 'positive' | 'neutral' | 'negative' {
  if (score >= 4) return 'positive';
  if (score >= 3) return 'neutral';
  return 'negative';
}
