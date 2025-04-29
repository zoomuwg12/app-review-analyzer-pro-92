
export interface ProcessedReview {
  original: string;
  processed: string;
  sentences: string[];
  words: string[];
  wordCount: number;
  uniqueWords: string[];
  uniqueWordCount: number;
}

export interface KeywordFrequency {
  word: string;
  count: number;
}

export interface AspectCategory {
  name: string;
  keywords: string[];
}
