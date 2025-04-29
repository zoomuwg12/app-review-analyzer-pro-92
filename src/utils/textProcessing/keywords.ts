
import { KeywordFrequency } from './types';
import { preprocessText } from './preprocessing';

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
