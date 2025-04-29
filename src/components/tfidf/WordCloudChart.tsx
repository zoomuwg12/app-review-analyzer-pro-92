
import React, { useMemo } from 'react';
import { TermWeight } from '@/utils/tfIdfProcessing';

interface WordCloudChartProps {
  terms: TermWeight[];
  maxTerms: number;
}

const WordCloudChart: React.FC<WordCloudChartProps> = ({ terms, maxTerms }) => {
  const cloudData = useMemo(() => {
    // Get the data subset we want to display
    const displayTerms = terms.slice(0, maxTerms);
    
    // Find the max and min weights to normalize sizes
    let maxWeight = 0;
    let minWeight = Infinity;
    
    displayTerms.forEach(term => {
      maxWeight = Math.max(maxWeight, term.weight);
      minWeight = Math.min(minWeight, term.weight);
    });
    
    // Calculate font sizes based on weights
    return displayTerms.map(term => {
      // Normalize weight to a range between 1 and 5
      const normalizedSize = maxWeight === minWeight
        ? 3
        : 1 + Math.floor(((term.weight - minWeight) / (maxWeight - minWeight)) * 4);
      
      return {
        term: term.term,
        weight: term.weight,
        size: normalizedSize
      };
    });
  }, [terms, maxTerms]);
  
  // Generate random positions for each term
  const wordCloudItems = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    const radius = 40;
    
    return cloudData.map((item, index) => {
      // Create a spiral-like arrangement
      const angle = (index / cloudData.length) * 2 * Math.PI * 3;
      const distance = (radius / 2) * (1 - index / cloudData.length);
      
      const x = centerX + (distance * Math.cos(angle));
      const y = centerY + (distance * Math.sin(angle));
      
      // Convert normalized size (1-5) to practical font sizes
      const fontSize = 12 + (item.size * 3);
      
      return {
        ...item,
        x,
        y,
        fontSize,
        // Generate a color from a gradient based on weight
        color: `hsl(${240 - Math.floor((item.size - 1) / 4 * 60)}, 70%, 50%)`
      };
    });
  }, [cloudData]);
  
  if (!terms.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="word-cloud">
        {wordCloudItems.map((item, index) => (
          <text
            key={item.term}
            x={`${item.x}%`}
            y={`${item.y}%`}
            fontSize={`${item.fontSize}px`}
            fill={item.color}
            textAnchor="middle"
            className="transition-all duration-300"
            style={{ 
              fontWeight: 500,
              opacity: 0.85,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              cursor: "pointer"
            }}
          >
            {item.term}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default WordCloudChart;
