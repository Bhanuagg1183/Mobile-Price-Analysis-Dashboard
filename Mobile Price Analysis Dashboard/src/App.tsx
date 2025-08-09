import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DataExplorer } from './components/DataExplorer';
import { ModelTrainer } from './components/ModelTrainer';
import { PricePrediction } from './components/PricePrediction';
import { ModelEvaluation } from './components/ModelEvaluation';
import { FeatureImportance } from './components/FeatureImportance';
import { generateSampleData } from './utils/dataGenerator';
import { PhoneDataset, TrainedModel } from './types/dataset';

function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [dataset, setDataset] = useState<PhoneDataset[]>([]);
  const [trainedModel, setTrainedModel] = useState<TrainedModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const data = generateSampleData(2000);
      setDataset(data);
      setIsLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'explore', label: 'Data Explorer', icon: '📊' },
    { id: 'train', label: 'Model Training', icon: '🔧' },
    { id: 'predict', label: 'Price Prediction', icon: '🎯' },
    { id: 'evaluate', label: 'Model Evaluation', icon: '📈' },
    { id: 'importance', label: 'Feature Analysis', icon: '🔍' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Mobile Phone Dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'explore' && <DataExplorer dataset={dataset} />}
          {activeTab === 'train' && (
            <ModelTrainer 
              dataset={dataset} 
              onModelTrained={setTrainedModel}
              trainedModel={trainedModel}
            />
          )}
          {activeTab === 'predict' && (
            <PricePrediction trainedModel={trainedModel} />
          )}
          {activeTab === 'evaluate' && (
            <ModelEvaluation trainedModel={trainedModel} dataset={dataset} />
          )}
          {activeTab === 'importance' && (
            <FeatureImportance trainedModel={trainedModel} dataset={dataset} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;