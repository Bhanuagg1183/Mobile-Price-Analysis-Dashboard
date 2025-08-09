import React from 'react';
import { TrainedModel, PhoneDataset } from '../types/dataset';
import { Target, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { Chart } from './Chart';
import { calculateMetrics } from '../utils/mlAlgorithms';

interface ModelEvaluationProps {
  trainedModel: TrainedModel | null;
  dataset: PhoneDataset[];
}

export const ModelEvaluation: React.FC<ModelEvaluationProps> = ({ trainedModel, dataset }) => {
  if (!trainedModel) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Model Available</h2>
        <p className="text-gray-600">Please train a model first in the Model Training tab.</p>
      </div>
    );
  }

  const metrics = calculateMetrics(trainedModel.actualValues, trainedModel.predictions);
  const priceLabels = ['Low Cost', 'Medium Cost', 'High Cost', 'Very High Cost'];

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Model Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Target className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-blue-800">Overall Accuracy</h3>
            <p className="text-2xl font-bold text-blue-600">{(metrics.accuracy * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-green-800">Avg Precision</h3>
            <p className="text-2xl font-bold text-green-600">
              {(metrics.precision.reduce((a, b) => a + b, 0) / metrics.precision.length * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-purple-800">Avg Recall</h3>
            <p className="text-2xl font-bold text-purple-600">
              {(metrics.recall.reduce((a, b) => a + b, 0) / metrics.recall.length * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <Target className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="font-semibold text-orange-800">Avg F1-Score</h3>
            <p className="text-2xl font-bold text-orange-600">
              {(metrics.f1Score.reduce((a, b) => a + b, 0) / metrics.f1Score.length * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics by Class */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Performance by Price Range</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3">Price Range</th>
                <th className="text-left p-3">Precision</th>
                <th className="text-left p-3">Recall</th>
                <th className="text-left p-3">F1-Score</th>
                <th className="text-left p-3">Support</th>
              </tr>
            </thead>
            <tbody>
              {priceLabels.map((label, index) => {
                const support = trainedModel.actualValues.filter(val => val === index).length;
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-3 font-medium">{label}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        metrics.precision[index] > 0.9 ? 'bg-green-100 text-green-800' :
                        metrics.precision[index] > 0.8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(metrics.precision[index] * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        metrics.recall[index] > 0.9 ? 'bg-green-100 text-green-800' :
                        metrics.recall[index] > 0.8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(metrics.recall[index] * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        metrics.f1Score[index] > 0.9 ? 'bg-green-100 text-green-800' :
                        metrics.f1Score[index] > 0.8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(metrics.f1Score[index] * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{support}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Confusion Matrix</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-medium mb-3">Predicted vs Actual</h3>
            <div className="grid grid-cols-5 gap-1 max-w-md">
              {/* Header */}
              <div></div>
              {priceLabels.map((label, index) => (
                <div key={index} className="p-2 text-center text-xs font-medium text-gray-600 transform -rotate-45">
                  {label.split(' ')[0]}
                </div>
              ))}
              
              {/* Matrix */}
              {trainedModel.confusionMatrix.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="p-2 text-xs font-medium text-gray-600 flex items-center">
                    {priceLabels[rowIndex].split(' ')[0]}
                  </div>
                  {row.map((value, colIndex) => (
                    <div
                      key={colIndex}
                      className={`p-3 text-center text-sm font-medium rounded ${
                        rowIndex === colIndex ? 'bg-blue-100 text-blue-800' :
                        value > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-500'
                      }`}
                      style={{
                        backgroundColor: rowIndex === colIndex ?
                          `rgba(59, 130, 246, ${Math.min(value / 50, 0.8) + 0.2})` :
                          value > 0 ? `rgba(239, 68, 68, ${Math.min(value / 20, 0.6) + 0.1})` :
                          'rgb(249, 250, 251)'
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-600">
              <p><strong>Rows:</strong> Actual values</p>
              <p><strong>Columns:</strong> Predicted values</p>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-3">Classification Report</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Model Summary</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Algorithm: <span className="font-medium capitalize">{trainedModel.type}</span></div>
                  <div>Training Time: <span className="font-medium">{trainedModel.trainingTime}ms</span></div>
                  <div>Test Samples: <span className="font-medium">{trainedModel.predictions.length}</span></div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Cross-Validation</h4>
                <div className="text-blue-600">
                  <div>Mean CV Score: <span className="font-medium">
                    {(trainedModel.crossValidationScores.reduce((a, b) => a + b, 0) / trainedModel.crossValidationScores.length * 100).toFixed(2)}%
                  </span></div>
                  <div>Std Deviation: <span className="font-medium">
                    {(Math.sqrt(trainedModel.crossValidationScores.reduce((acc, val) => {
                      const mean = trainedModel.crossValidationScores.reduce((a, b) => a + b, 0) / trainedModel.crossValidationScores.length;
                      return acc + Math.pow(val - mean, 2);
                    }, 0) / trainedModel.crossValidationScores.length) * 100).toFixed(2)}%
                  </span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Validation Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Cross-Validation Results</h2>
        <Chart
          type="line"
          data={trainedModel.crossValidationScores.map(score => score * 100)}
          labels={trainedModel.crossValidationScores.map((_, index) => `Fold ${index + 1}`)}
          color="rgba(139, 92, 246, 0.8)"
          height={250}
        />
        <div className="mt-4 text-sm text-gray-600">
          <p>Cross-validation helps ensure the model generalizes well to unseen data by testing on multiple data splits.</p>
        </div>
      </div>
    </div>
  );
};