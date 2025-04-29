
// Simple stemmer implementation (Porter stemming algorithm simplified)
export function stemWord(word: string): string {
  if (word.length < 3) return word;
  
  // Step 1: Remove plurals and -ed or -ing
  
  // Ends in 'ies' but not 'eies' or 'aies'
  if (word.endsWith('ies') && word.length > 4) 
    return word.slice(0, -3) + 'y';
  
  // Remove 'es', but not after 'ss' or 'us'
  if (word.endsWith('es') && !word.endsWith('sses') && !word.endsWith('uses') && word.length > 3) 
    return word.slice(0, -2);
  
  // Remove 's' at the end if the word is longer than 3 characters
  if (word.endsWith('s') && word.length > 3 && !word.endsWith('ss')) 
    return word.slice(0, -1);
  
  // Handle -ed and -ing
  if (word.endsWith('ed') && word.length > 4) {
    const stem = word.slice(0, -2);
    // Double consonant
    if (stem.length >= 2 && stem[stem.length-1] === stem[stem.length-2]) {
      return stem.slice(0, -1);
    }
    return stem;
  }
  
  if (word.endsWith('ing') && word.length > 5) {
    const stem = word.slice(0, -3);
    // Double consonant
    if (stem.length >= 2 && stem[stem.length-1] === stem[stem.length-2]) {
      return stem.slice(0, -1);
    }
    return stem;
  }
  
  // Step 2: Handle specific suffixes
  if (word.endsWith('ational')) return word.slice(0, -7) + 'ate';
  if (word.endsWith('tional')) return word.slice(0, -6) + 'tion';
  if (word.endsWith('alize')) return word.slice(0, -5) + 'al';
  if (word.endsWith('ousness')) return word.slice(0, -7) + 'ous';
  if (word.endsWith('iveness')) return word.slice(0, -7) + 'ive';
  if (word.endsWith('fulness')) return word.slice(0, -7) + 'ful';
  if (word.endsWith('ement')) return word.slice(0, -5);
  
  // Step 3: Remove common suffixes
  const suffixes = ['ment', 'ness', 'able', 'ible', 'ship', 'less', 'ize', 'ise', 'ify', 'ful', 'ous', 'ity'];
  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 2) {
      return word.slice(0, -suffix.length);
    }
  }
  
  return word;
}
