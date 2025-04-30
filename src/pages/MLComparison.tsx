
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppReview } from '@/utils/scraper';
import { 
  prepareData, 
  calculateConfusionMatrix, 
  ModelEvaluation, 
  NaiveBayes, 
  SVM, 
  RandomForest 
} from '@/utils/ml';
import ConfigurationCard from '@/components/ml/ConfigurationCard';
import ResultsCard from '@/components/ml/ResultsCard';
import AlgorithmExplanationCard from '@/components/ml/AlgorithmExplanationCard';
import NoDataCard from '@/components/ml/NoDataCard';
import { supabase } from "@/integrations/supabase/client";

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
  const [isSavingToDatabase, setIsSavingToDatabase] = useState<boolean>(false);
  const [isPreviousResultsLoading, setIsPreviousResultsLoading] = useState<boolean>(false);
  
  // Load previous results when component mounts
  useEffect(() => {
    if (app?.appId) {
      loadPreviousResults(app.appId);
    }
  }, [app?.appId]);
  
  const loadPreviousResults = async (appId: string) => {
    try {
      setIsPreviousResultsLoading(true);
      
      // Fetch results from Supabase
      const { data, error } = await supabase
        .from('ml_comparisons')
        .select('*')
        .eq('app_id', appId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Convert Supabase data to ModelEvaluation format
        const loadedEvaluations: ModelEvaluation[] = data.map(item => ({
          modelName: item.model_name,
          splitRatio: item.split_ratio,
          predictionTime: item.prediction_time,
          confusionMatrix: {
            truePositive: item.true_positives,
            falsePositive: item.false_positives,
            trueNegative: item.true_negatives,
            falseNegative: item.false_negatives,
            accuracy: item.accuracy,
            precision: item.precision,
            recall: item.recall,
            f1Score: item.f1_score
          }
        }));
        
        setEvaluations(loadedEvaluations);
        toast({
          title: "Previous results loaded",
          description: `Loaded ${loadedEvaluations.length} evaluation results from the database.`,
        });
      }
    } catch (error) {
      console.error('Error loading previous results:', error);
      toast({
        title: "Failed to load previous results",
        description: "Could not fetch evaluation results from the database.",
        variant: "destructive",
      });
    } finally {
      setIsPreviousResultsLoading(false);
    }
  };
  
  const saveResultsToDatabase = async (evaluationsToSave: ModelEvaluation[]) => {
    if (!app?.appId) {
      toast({
        title: "Cannot save results",
        description: "App information is missing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSavingToDatabase(true);
      
      // Prepare data for insertion
      const dataToInsert = evaluationsToSave.map(evaluation => ({
        app_id: app.appId,
        model_name: evaluation.modelName,
        split_ratio: evaluation.splitRatio,
        accuracy: evaluation.confusionMatrix.accuracy,
        precision: evaluation.confusionMatrix.precision,
        recall: evaluation.confusionMatrix.recall,
        f1_score: evaluation.confusionMatrix.f1Score,
        true_positives: evaluation.confusionMatrix.truePositive,
        false_positives: evaluation.confusionMatrix.falsePositive,
        true_negatives: evaluation.confusionMatrix.trueNegative,
        false_negatives: evaluation.confusionMatrix.falseNegative,
        prediction_time: evaluation.predictionTime
      }));
      
      // Insert into Supabase
      const { error } = await supabase
        .from('ml_comparisons')
        .insert(dataToInsert);
      
      if (error) throw error;
      
      toast({
        title: "Results saved successfully",
        description: `Saved ${evaluationsToSave.length} evaluation results to the database.`,
      });
    } catch (error) {
      console.error('Error saving results to database:', error);
      toast({
        title: "Failed to save results",
        description: "Could not save evaluation results to the database.",
        variant: "destructive",
      });
    } finally {
      setIsSavingToDatabase(false);
    }
  };
  
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
      
      // Save results to database
      await saveResultsToDatabase(results);
      
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
    return <NoDataCard />;
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
            <p className="text-muted-foreground">
              {reviews.length} reviews available
              {evaluations.length > 0 && ` • ${evaluations.length} evaluations stored`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ConfigurationCard
          selectedModels={selectedModels}
          selectedRatio={selectedRatio}
          isTraining={isTraining}
          onToggleModel={handleToggleModel}
          onSelectRatio={setSelectedRatio}
          onRunComparison={runComparison}
        />
        
        <ResultsCard 
          evaluations={evaluations}
          selectedMetric={selectedMetric}
          selectedRatio={selectedRatio}
          onSelectMetric={setSelectedMetric}
          onSelectRatio={setSelectedRatio}
          isLoading={isPreviousResultsLoading}
        />
      </div>
      
      <AlgorithmExplanationCard />
    </div>
  );
};

export default MLComparison;
