
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const AlgorithmExplanationCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About ML Algorithms</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Naive Bayes</h3>
            <p className="text-muted-foreground">
              A probabilistic classifier based on Bayes' theorem. It assumes that the presence of a particular feature is unrelated to other features, which simplifies computation but may limit accuracy in complex datasets.
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Fast training and prediction</li>
              <li>Works well with small datasets</li>
              <li>Simple implementation</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Support Vector Machine (SVM)</h3>
            <p className="text-muted-foreground">
              A supervised learning model that finds the optimal hyperplane to separate different classes. SVM is effective in high-dimensional spaces and works well with clear margins of separation.
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Effective in high dimensions</li>
              <li>Memory efficient</li>
              <li>Versatile with different kernel functions</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Random Forest</h3>
            <p className="text-muted-foreground">
              An ensemble learning method that constructs multiple decision trees and outputs the class that is the mode of the individual trees. Random forests correct for decision trees' habit of overfitting.
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Handles high dimensionality well</li>
              <li>Resistant to overfitting</li>
              <li>Provides feature importance metrics</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">About this implementation</h3>
          <p className="text-muted-foreground">
            This is a simplified browser-based implementation of these algorithms for educational purposes. For production applications, consider using specialized ML libraries like TensorFlow.js or server-side solutions for more accurate and scalable results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmExplanationCard;
