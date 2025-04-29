
import { ProcessedReview } from "./textProcessing";
import { AppReview } from "./scraper";

export interface TermWeight {
  term: string;
  weight: number;
}

export interface DocumentTfIdf {
  documentId: string;
  terms: TermWeight[];
}

/**
 * Calculate Term Frequency for a document
 * TF = (Number of times term t appears in a document) / (Total number of terms in the document)
 */
export function calculateTermFrequency(terms: string[]): Map<string, number> {
  const termFrequency = new Map<string, number>();
  const totalTerms = terms.length || 1; // Prevent division by zero
  
  // Count occurrences of each term
  terms.forEach(term => {
    termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
  });
  
  // Normalize by document length
  termFrequency.forEach((count, term) => {
    termFrequency.set(term, count / totalTerms);
  });
  
  return termFrequency;
}

/**
 * Calculate Inverse Document Frequency
 * IDF = log(Total number of documents / Number of documents containing the term)
 */
export function calculateInverseDocumentFrequency(
  documents: string[][],
  uniqueTerms: Set<string>
): Map<string, number> {
  const idf = new Map<string, number>();
  const totalDocuments = documents.length || 1; // Prevent division by zero
  
  uniqueTerms.forEach(term => {
    // Count documents containing the term
    const documentsWithTerm = documents.filter(doc => doc.includes(term)).length;
    // Calculate IDF with smoothing to avoid division by zero
    const idfValue = Math.log((totalDocuments + 1) / (documentsWithTerm + 1)) + 1;
    idf.set(term, idfValue);
  });
  
  return idf;
}

/**
 * Calculate TF-IDF for all documents
 */
export function calculateTfIdf(documents: string[][]): DocumentTfIdf[] {
  if (!documents.length) return [];

  // Get all unique terms across all documents
  const uniqueTerms = new Set<string>();
  documents.forEach(doc => {
    doc.forEach(term => {
      if (term && term.trim()) {
        uniqueTerms.add(term.trim());
      }
    });
  });
  
  // Calculate IDF for all terms
  const idf = calculateInverseDocumentFrequency(documents, uniqueTerms);
  
  // Calculate TF-IDF for each document
  return documents.map((doc, index) => {
    const tf = calculateTermFrequency(doc);
    
    // Calculate TF-IDF
    const documentTerms: TermWeight[] = [];
    uniqueTerms.forEach(term => {
      const tfValue = tf.get(term) || 0;
      const idfValue = idf.get(term) || 0;
      const tfidf = tfValue * idfValue;
      
      if (tfidf > 0) {
        documentTerms.push({
          term,
          weight: tfidf
        });
      }
    });
    
    // Sort by weight descending
    documentTerms.sort((a, b) => b.weight - a.weight);
    
    return {
      documentId: `doc-${index}`,
      terms: documentTerms
    };
  });
}

/**
 * Process reviews for TF-IDF analysis
 */
export function processTfIdf(reviews: AppReview[]): {
  allDocumentsTfIdf: DocumentTfIdf[];
  topTermsOverall: TermWeight[];
} {
  if (!reviews || !reviews.length) {
    return { allDocumentsTfIdf: [], topTermsOverall: [] };
  }

  // Prepare documents (each document is a review)
  const documents = reviews.map(review => {
    // Use processed content if available, otherwise use original content
    const content = review.processedContent || review.content || "";
    return content.split(/\s+/).filter(term => term && term.length > 0);
  });
  
  // Calculate TF-IDF for all documents
  const allDocumentsTfIdf = calculateTfIdf(documents);
  
  // Calculate overall most important terms across all documents
  const termWeightMap = new Map<string, number>();
  
  allDocumentsTfIdf.forEach(doc => {
    doc.terms.forEach(termWeight => {
      const currentWeight = termWeightMap.get(termWeight.term) || 0;
      termWeightMap.set(termWeight.term, currentWeight + termWeight.weight);
    });
  });
  
  // Convert to array and sort by weight
  const topTermsOverall = Array.from(termWeightMap.entries())
    .map(([term, weight]) => ({ term, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 100); // Top 100 terms
  
  return { allDocumentsTfIdf, topTermsOverall };
}
