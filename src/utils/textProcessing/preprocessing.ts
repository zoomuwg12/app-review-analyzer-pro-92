
import { ProcessedReview } from './types';
import { STOP_WORDS } from './stopWords';
import { stemWord } from './stemming';

export function preprocessText(text: string, options: {
  lowercase?: boolean;
  removeStopWords?: boolean;
  removeNumbers?: boolean;
  removePunctuation?: boolean;
  removeTags?: boolean;
  applyStemming?: boolean;
} = {}): ProcessedReview {
  const {
    lowercase = true,
    removeStopWords = true,
    removeNumbers = false,
    removePunctuation = true,
    removeTags = true,
    applyStemming = false
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
  
  // Apply stemming if enabled
  if (applyStemming) {
    filteredWords = filteredWords.map(word => stemWord(word));
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
