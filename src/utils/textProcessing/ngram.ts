
/**
 * N-Gram text analysis utilities
 */

/**
 * Generate N-Grams from an array of words
 * @param words Array of words to process
 * @param n The 'n' in n-gram (2 for bigrams, 3 for trigrams, etc.)
 * @returns Array of n-grams
 */
export function generateNgrams(words: string[], n: number = 2): string[] {
  if (n < 1) return [];
  if (words.length < n) return [];
  
  const ngrams: string[] = [];
  
  for (let i = 0; i <= words.length - n; i++) {
    const ngram = words.slice(i, i + n).join(' ');
    ngrams.push(ngram);
  }
  
  return ngrams;
}

/**
 * Count and sort n-grams by frequency
 * @param ngramArray Array of n-grams
 * @param limit Maximum number of results to return
 * @returns Sorted array of n-grams with their frequencies
 */
export function getNgramFrequencies(ngramArray: string[], limit: number = 100): Array<{ngram: string, count: number}> {
  const freqMap: Record<string, number> = {};
  
  // Count occurrences of each n-gram
  for (const ngram of ngramArray) {
    freqMap[ngram] = (freqMap[ngram] || 0) + 1;
  }
  
  // Convert to array and sort by frequency
  return Object.entries(freqMap)
    .map(([ngram, count]) => ({ ngram, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Process a collection of reviews to extract and analyze n-grams
 * @param reviews Array of app reviews
 * @param n The 'n' in n-gram (2 for bigrams, 3 for trigrams, etc.)
 * @param limit Maximum number of results to return
 * @returns Sorted array of n-grams with their frequencies
 */
export function processNgrams(reviews: any[], n: number = 2, limit: number = 50) {
  // Collect all processed review content
  const allContent = reviews
    .map(review => review.processedContent || review.content)
    .filter(Boolean);
    
  // Split each review into words and generate n-grams
  const allNgrams = allContent.flatMap(content => {
    const words = content.split(/\s+/).filter(word => word.trim().length > 0);
    return generateNgrams(words, n);
  });
  
  // Get frequencies
  return getNgramFrequencies(allNgrams, limit);
}
