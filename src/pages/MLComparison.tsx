import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppReview } from '@/utils/scraper';
import { prepareData, calculateConfusionMatrix, ModelEvaluation } from '@/utils/mlAlgorithms';
import { NaiveBayes, SVM, RandomForest } from '@/utils/mlAlgorithms';
import SplitRatioSelector from '@/components/ml/SplitRatioSelector';
import ModelSelector from '@/components/ml/ModelSelector';
import ConfusionMatrixCard from '@/components/ml/ConfusionMatrixCard';
import ModelComparisonChart from '@/components/ml/ModelComparisonChart';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const MLComparison: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { reviews, app } = location.state || { reviews: [], app: null };
  
  // Model selection state
  const [selectedModels, setSelectedModels] = useState<string[]>(['Naive Bayes', 'SVM', 'Random Forest']);
  const [selectedRatio, setSelectedRatio] = useState<string>('70:30');
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'precision' | 'recall' | 'f1Score'>('accuracy');
  
  // Results state
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [evaluations, setEvaluations] = useState<ModelEvaluation[]>([]);
  
  // Handle model toggle
  const handleToggleModel = (modelName: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelName)) {
        return prev.filter(m => m !== modelName);
      } else {
        return [...prev, modelName];
      }
    });
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  const getSplitRatio = (ratioString: string): number => {
    const [train] = ratioString.split(':').map(Number);
    return train / 100;
  };
  
  const runComparison = async () => {
    if (!reviews?.length || selectedModels.length === 0) {
      toast({
        title: "Cannot run comparison",
        description: "Please select at least one model and ensure reviews are loaded.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTraining(true);
    setEvaluations([]);
    
    try {
      // Define ratios to test
      const ratios = ['65:35', '70:30', '75:25', '80:20'];
      
      // Models to test
      const models = {
        'Naive Bayes': new NaiveBayes(),
        'SVM': new SVM(),
        'Random Forest': new RandomForest()
      };
      
      // Create a batch of tasks for each model and ratio
      const tasks: Promise<ModelEvaluation>[] = [];
      
      // Schedule all evaluations with setTimeout to prevent UI blocking
      for (const ratio of ratios) {
        for (const modelName of selectedModels) {
          if (!models[modelName as keyof typeof models]) continue;
          
          // Use Promise to handle async evaluation
          tasks.push(new Promise((resolve) => {
            setTimeout(() => {
              const trainRatio = getSplitRatio(ratio);
              const { trainingData, testingData } = prepareData(reviews, 1 - trainRatio);
              
              const model = models[modelName as keyof typeof models];
              model.train(trainingData);
              
              // Measure prediction time
              const startTime = performance.now();
              const predictions = testingData.features.map(feature => model.predict(feature));
              const endTime = performance.now();
              const predictionTime = endTime - startTime;
              
              // Calculate confusion matrix
              const confusionMatrix = calculateConfusionMatrix(testingData.labels, predictions);
              
              resolve({
                modelName,
                splitRatio: ratio,
                confusionMatrix,
                predictionTime
              });
            }, 0);
          }));
        }
      }
      
      // Wait for all evaluations to complete
      const results = await Promise.all(tasks);
      setEvaluations(results);
      
      toast({
        title: "Model comparison complete",
        description: `Evaluated ${selectedModels.length} models across ${ratios.length} splitting ratios.`,
      });
    } catch (error) {
      console.error('Error during model comparison:', error);
      toast({
        title: "Error during comparison",
        description: "An error occurred while running the model comparison.",
        variant: "destructive",
      });
    } finally {
      setIsTraining(false);
    }
  };
  
  if (!app || !reviews?.length) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">No data available</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please select an app with reviews first.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{app.title} - ML Model Comparison</h1>
            <p className="text-muted-foreground">{reviews.length} reviews available</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ModelSelector 
              selectedModels={selectedModels}
              onToggleModel={handleToggleModel}
            />
            
            <SplitRatioSelector 
              selectedRatio={selectedRatio}
              onSelectRatio={setSelectedRatio}
            />
            
            <Button 
              onClick={runComparison} 
              disabled={isTraining || selectedModels.length === 0}
              className="w-full"
            >
              {isTraining ? (
                <>
                  <Play className="mr-2 h-4 w-4 animate-spin" />
                  Running Comparison...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Comparison
                </>
              )}
            </Button>
            
            {selectedModels.length === 0 && (
              <Alert variant="destructive">
                <AlertTitle>No models selected</AlertTitle>
                <AlertDescription>
                  Please select at least one model to run the comparison.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Results</span>
              
              {evaluations.length > 0 && (
                <div className="space-x-1">
                  <Button 
                    variant={selectedMetric === 'accuracy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetric('accuracy')}
                  >
                    Accuracy
                  </Button>
                  <Button 
                    variant={selectedMetric === 'precision' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetric('precision')}
                  >
                    Precision
                  </Button>
                  <Button 
                    variant={selectedMetric === 'recall' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetric('recall')}
                  >
                    Recall
                  </Button>
                  <Button 
                    variant={selectedMetric === 'f1Score' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetric('f1Score')}
                  >
                    F1 Score
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evaluations.length > 0 ? (
              <div className="space-y-6">
                <ModelComparisonChart 
                  evaluations={evaluations} 
                  metric={selectedMetric}
                />
                
                {/* Show details for the selected split ratio */}
                <Tabs defaultValue={selectedRatio} value={selectedRatio} onValueChange={setSelectedRatio}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="65:35">65:35</TabsTrigger>
                    <TabsTrigger value="70:30">70:30</TabsTrigger>
                    <TabsTrigger value="75:25">75:25</TabsTrigger>
                    <TabsTrigger value="80:20">80:20</TabsTrigger>
                  </TabsList>
                  {['65:35', '70:30', '75:25', '80:20'].map(ratio => (
                    <TabsContent key={ratio} value={ratio} className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {evaluations
                          .filter(e => e.splitRatio === ratio)
                          .map((evaluation, index) => (
                            <ConfusionMatrixCard 
                              key={`${evaluation.modelName}-${ratio}-${index}`}
                              modelName={evaluation.modelName}
                              confusionMatrix={evaluation.confusionMatrix}
                              splitRatio={evaluation.splitRatio}
                              predictionTime={evaluation.predictionTime}
                            />
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No comparison data yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Configure your models and split ratio, then click the "Run Comparison" button to see results here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
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
    </div>
  );
};

export default MLComparison;
