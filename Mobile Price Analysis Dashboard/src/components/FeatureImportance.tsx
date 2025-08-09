import React from 'react';
import { TrainedModel, PhoneDataset } from '../types/dataset';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { Chart } from './Chart';

interface FeatureImportanceProps {
  trainedModel: TrainedModel | null;
  dataset: PhoneDataset[];
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({ trainedModel, dataset }) => {
  if (!trainedModel) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Model Available</h2>
        <p className="text-gray-600">Please train a model first in the Model Training tab.</p>
      </div>
    );
  }

  const sortedFeatures = [...trainedModel.featureImportance].sort((a, b) => b.importance - a.importance);
  const topFeatures = sortedFeatures.slice(0, 10);
  
  const featureDescriptions: { [key: string]: string } = {
    battery_power: 'Battery capacity in mAh - higher capacity phones tend to be more expensive',
    ram: 'System memory in MB - more RAM indicates better performance and higher price',
    int_memory: 'Internal storage in GB - affects phone capabilities and price point',
    pc: 'Primary camera megapixels - better cameras command premium prices',
    px_height: 'Screen resolution height - higher resolution displays are more expensive',
    px_width: 'Screen resolution width - affects display quality and pricing',
    mobile_wt: 'Phone weight in grams - premium materials may affect weight and cost',
    clock_speed: 'Processor speed in GHz - faster processors increase phone value',
    sc_h: 'Screen height in cm - larger screens typically cost more',
    sc_w: 'Screen width in cm - affects display size and pricing',
    talk_time: 'Battery life in hours - better battery life adds value',
    fc: 'Front camera megapixels - selfie camera quality affects pricing',
    n_cores: 'Number of processor cores - more cores indicate better performance',
    four_g: '4G connectivity support - essential feature affecting price range',
    three_g: '3G connectivity support - basic connectivity feature',
    wifi: 'WiFi support - standard connectivity feature',
    blue: 'Bluetooth support - common connectivity feature',
    dual_sim: 'Dual SIM support - convenience feature',
    touch_screen: 'Touch screen capability - standard feature',
    m_deep: 'Phone depth/thickness in cm - affects design and materials'
  };

  return (
    <div className="space-y-6">
      {/* Feature Importance Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Feature Importance Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-blue-800">Most Important</h3>
            <p className="text-lg font-medium text-blue-600 capitalize">
              {topFeatures[0]?.feature.replace('_', ' ')}
            </p>
            <p className="text-sm text-blue-600">{(topFeatures[0]?.importance * 100).toFixed(1)}% importance</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <Zap className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-green-800">Top 3 Features</h3>
            <p className="text-sm text-green-600">
              Account for {(topFeatures.slice(0, 3).reduce((sum, f) => sum + f.importance, 0) * 100).toFixed(1)}% 
              of model decisions
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-purple-800">Algorithm</h3>
            <p className="text-lg font-medium text-purple-600 capitalize">
              {trainedModel.type.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        </div>

        <Chart
          type="bar"
          data={topFeatures.map(f => f.importance * 100)}
          labels={topFeatures.map(f => f.feature.replace('_', ' '))}
          color="rgba(59, 130, 246, 0.8)"
          height={400}
        />
      </div>

      {/* Detailed Feature Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Detailed Feature Analysis</h2>
        <div className="space-y-4">
          {topFeatures.map((feature, index) => (
            <div key={feature.feature} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg capitalize">
                    {feature.feature.replace('_', ' ')}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {(feature.importance * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">importance</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${feature.importance * 100}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600">
                {featureDescriptions[feature.feature] || 'This feature contributes to the price prediction model.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Categories */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Feature Categories Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              category: 'Hardware',
              features: ['battery_power', 'ram', 'int_memory', 'clock_speed', 'n_cores'],
              color: 'blue'
            },
            {
              category: 'Camera',
              features: ['pc', 'fc'],
              color: 'green'
            },
            {
              category: 'Display',
              features: ['px_height', 'px_width', 'sc_h', 'sc_w'],
              color: 'purple'
            },
            {
              category: 'Physical & Other',
              features: ['mobile_wt', 'm_deep', 'talk_time', 'four_g', 'three_g', 'wifi', 'blue', 'dual_sim', 'touch_screen'],
              color: 'orange'
            }
          ].map((category) => {
            const categoryImportance = trainedModel.featureImportance
              .filter(f => category.features.includes(f.feature))
              .reduce((sum, f) => sum + f.importance, 0);
            
            return (
              <div key={category.category} className={`p-4 rounded-lg border-2 border-${category.color}-200 bg-${category.color}-50`}>
                <h3 className={`font-semibold text-${category.color}-800 mb-2`}>{category.category}</h3>
                <div className={`text-2xl font-bold text-${category.color}-600 mb-1`}>
                  {(categoryImportance * 100).toFixed(1)}%
                </div>
                <div className={`text-xs text-${category.color}-600`}>
                  {category.features.length} feature{category.features.length > 1 ? 's' : ''}
                </div>
                <div className={`w-full bg-${category.color}-200 rounded-full h-1 mt-2`}>
                  <div
                    className={`bg-${category.color}-500 h-1 rounded-full`}
                    style={{ width: `${Math.min(categoryImportance * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Key Insights & Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Model Insights</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>{topFeatures[0]?.feature.replace('_', ' ')}</strong> is the strongest predictor of phone pricing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  Hardware specifications (RAM, Battery, Memory) are crucial for price determination
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>
                  Display and camera features significantly impact pricing decisions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>
                  Connectivity features have moderate influence on price classification
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Business Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">💡</span>
                <span>
                  Focus on optimizing the top 5 features for competitive pricing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">💡</span>
                <span>
                  Consider hardware specifications as primary differentiators
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">💡</span>
                <span>
                  Camera quality can justify premium pricing in higher segments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">💡</span>
                <span>
                  Balance feature costs with their impact on price classification
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};