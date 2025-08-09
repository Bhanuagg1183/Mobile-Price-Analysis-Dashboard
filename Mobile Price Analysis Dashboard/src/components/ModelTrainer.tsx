import React, { useState } from 'react';
import { PhoneDataset, TrainedModel } from '../types/dataset';
import { Play, Zap, Target, Clock } from 'lucide-react';
import { trainRandomForest, trainDecisionTree, trainSVM } from '../utils/mlAlgorithms';
import { Chart } from './Chart';

interface ModelTrainerProps {
  dataset: PhoneDataset[];
  onModelTrained: (model: TrainedModel) => void;
  trainedModel: TrainedModel | null;
}

export const ModelTrainer: React.FC<ModelTrainerProps> = ({ 
  dataset, 
  onModelTrained, 
  trainedModel 
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'randomForest' | 'decisionTree' | 'svm'>('randomForest');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const algorithms = [
    {
      id: 'randomForest' as const,
      name: 'Random Forest',
      description: 'Ensemble method with high accuracy and robustness',
      icon: '🌲',
      pros: ['High accuracy', 'Handles overfitting well', 'Feature importance'],
      expectedAccuracy: '92-95%'
    },
    {
      id: 'decisionTree' as const,
      name: 'Decision Tree',
      description: 'Simple and interpretable tree-based classifier',
      icon: '🌳',
      pros: ['Easy to interpret', 'Fast training', 'No feature scaling needed'],
      expectedAccuracy: '85-88%'
    },
    {
      id: 'svm' as const,
      name: 'Support Vector Machine',
      description: 'Powerful classifier for complex decision boundaries',
      icon: '⚡',
      pros: ['Good for complex patterns', 'Memory efficient', 'Versatile'],
      expectedAccuracy: '88-91%'
    }
  ];

  const handleTrainModel = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      let model: TrainedModel;
      
      switch (selectedAlgorithm) {
        case 'randomForest':
          model = await trainRandomForest(dataset);
          break;
        case 'decisionTree':
          model = await trainDecisionTree(dataset);
          break;
        case 'svm':
          model = await trainSVM(dataset);
          break;
        default:
          throw new Error('Unknown algorithm');
      }

      setTrainingProgress(100);
      setTimeout(() => {
        onModelTrained(model);
        setIsTraining(false);
        setTrainingProgress(0);
      }, 500);

    } catch (error) {
      console.error('Training failed:', error);
      setIsTraining(false);
      setTrainingProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Select Machine Learning Algorithm</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              onClick={() => setSelectedAlgorithm(algorithm.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{algorithm.icon}</span>
                <h3 className="font-semibold">{algorithm.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{algorithm.description}</p>
              <div className="space-y-1">
                {algorithm.pros.map((pro, index) => (
                  <div key={index} className="text-xs text-green-600 flex items-center gap-1">
                    <span>✓</span>
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-blue-600 font-medium">
                Expected: {algorithm.expectedAccuracy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Model Training</h2>
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isTraining
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
            }`}
          >
            {isTraining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Training...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Train Model</span>
              </>
            )}
          </button>
        </div>

        {isTraining && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Training Progress</span>
              <span>{trainingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Training Size: {Math.floor(dataset.length * 0.8)} samples</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Test Size: {Math.floor(dataset.length * 0.2)} samples</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Cross-validation: 5-fold</span>
          </div>
        </div>
      </div>

      {/* Training Results */}
      {trainedModel && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Training Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800">Accuracy</h3>
              <p className="text-2xl font-bold text-green-600">{(trainedModel.accuracy * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">Algorithm</h3>
              <p className="text-lg font-medium text-blue-600 capitalize">
                {trainedModel.type.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800">Training Time</h3>
              <p className="text-lg font-medium text-purple-600">{trainedModel.trainingTime}ms</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800">CV Score</h3>
              <p className="text-lg font-medium text-orange-600">
                {(trainedModel.crossValidationScores.reduce((a, b) => a + b, 0) / trainedModel.crossValidationScores.length * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Confusion Matrix Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Confusion Matrix</h3>
            <div className="grid grid-cols-4 gap-1 max-w-md">
              {trainedModel.confusionMatrix.flat().map((value, index) => (
                <div
                  key={index}
                  className={`p-3 text-center text-sm font-medium rounded ${
                    value > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                  }`}
                  style={{ 
                    backgroundColor: value > 0 ? 
                      `rgba(59, 130, 246, ${Math.min(value / 50, 1)})` : 
                      'rgb(243, 244, 246)' 
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 max-w-md">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Cross-validation Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cross-validation Scores</h3>
            <Chart
              type="bar"
              data={trainedModel.crossValidationScores.map(score => score * 100)}
              labels={trainedModel.crossValidationScores.map((_, index) => `Fold ${index + 1}`)}
              color="rgba(139, 92, 246, 0.8)"
              height={200}
            />
          </div>
        </div>
      )}
    </div>
  );
};