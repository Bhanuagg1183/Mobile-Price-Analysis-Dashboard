import React, { useState } from 'react';
import { TrainedModel, PredictionInput } from '../types/dataset';
import { Smartphone, Zap, AlertCircle } from 'lucide-react';
import { predictPrice } from '../utils/mlAlgorithms';

interface PricePredictionProps {
  trainedModel: TrainedModel | null;
}

export const PricePrediction: React.FC<PricePredictionProps> = ({ trainedModel }) => {
  const [formData, setFormData] = useState<PredictionInput>({
    battery_power: 3000,
    blue: 1,
    clock_speed: 2.5,
    dual_sim: 1,
    fc: 8,
    four_g: 1,
    int_memory: 64,
    m_deep: 0.8,
    mobile_wt: 150,
    n_cores: 4,
    pc: 12,
    px_height: 1920,
    px_width: 1080,
    ram: 4096,
    sc_h: 15,
    sc_w: 7,
    talk_time: 15,
    three_g: 1,
    touch_screen: 1,
    wifi: 1
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number[]>([]);
  const [isLoading, setPredicting] = useState(false);

  const handleInputChange = (key: keyof PredictionInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handlePredict = async () => {
    if (!trainedModel) return;

    setPredicting(true);
    
    // Simulate prediction delay
    setTimeout(() => {
      const result = predictPrice(trainedModel, formData);
      setPrediction(result.prediction);
      setConfidence(result.confidence);
      setPredicting(false);
    }, 1000);
  };

  const loadPreset = (preset: 'budget' | 'mid' | 'premium' | 'flagship') => {
    const presets = {
      budget: {
        battery_power: 2500, blue: 1, clock_speed: 1.8, dual_sim: 1, fc: 5,
        four_g: 0, int_memory: 16, m_deep: 0.9, mobile_wt: 180, n_cores: 2,
        pc: 8, px_height: 1280, px_width: 720, ram: 2048, sc_h: 12, sc_w: 6,
        talk_time: 12, three_g: 1, touch_screen: 1, wifi: 1
      },
      mid: {
        battery_power: 3500, blue: 1, clock_speed: 2.2, dual_sim: 1, fc: 8,
        four_g: 1, int_memory: 32, m_deep: 0.8, mobile_wt: 160, n_cores: 4,
        pc: 13, px_height: 1920, px_width: 1080, ram: 3072, sc_h: 14, sc_w: 7,
        talk_time: 16, three_g: 1, touch_screen: 1, wifi: 1
      },
      premium: {
        battery_power: 4000, blue: 1, clock_speed: 2.8, dual_sim: 1, fc: 12,
        four_g: 1, int_memory: 128, m_deep: 0.7, mobile_wt: 140, n_cores: 6,
        pc: 20, px_height: 2340, px_width: 1080, ram: 6144, sc_h: 16, sc_w: 7.5,
        talk_time: 20, three_g: 1, touch_screen: 1, wifi: 1
      },
      flagship: {
        battery_power: 5000, blue: 1, clock_speed: 3.2, dual_sim: 1, fc: 32,
        four_g: 1, int_memory: 256, m_deep: 0.6, mobile_wt: 135, n_cores: 8,
        pc: 48, px_height: 3200, px_width: 1440, ram: 12288, sc_h: 17, sc_w: 8,
        talk_time: 25, three_g: 1, touch_screen: 1, wifi: 1
      }
    };
    setFormData(presets[preset]);
    setPrediction(null);
    setConfidence([]);
  };

  const priceLabels = ['Low Cost', 'Medium Cost', 'High Cost', 'Very High Cost'];
  const priceColors = ['text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
  const priceBgColors = ['bg-green-100', 'bg-yellow-100', 'bg-orange-100', 'bg-red-100'];

  if (!trainedModel) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Model Available</h2>
        <p className="text-gray-600">Please train a model first in the Model Training tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Quick Phone Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'budget', label: 'Budget Phone', icon: '📱', desc: 'Basic features' },
            { key: 'mid', label: 'Mid-range', icon: '📲', desc: 'Good balance' },
            { key: 'premium', label: 'Premium', icon: '📞', desc: 'High-end specs' },
            { key: 'flagship', label: 'Flagship', icon: '🔥', desc: 'Top-tier device' }
          ].map((preset) => (
            <button
              key={preset.key}
              onClick={() => loadPreset(preset.key as any)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{preset.icon}</div>
              <div className="font-medium text-gray-800">{preset.label}</div>
              <div className="text-xs text-gray-600">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Phone Specifications</h2>
          
          <div className="space-y-4">
            {/* Hardware Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Battery Power (mAh)
                </label>
                <input
                  type="number"
                  value={formData.battery_power}
                  onChange={(e) => handleInputChange('battery_power', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RAM (MB)
                </label>
                <input
                  type="number"
                  value={formData.ram}
                  onChange={(e) => handleInputChange('ram', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internal Memory (GB)
                </label>
                <input
                  type="number"
                  value={formData.int_memory}
                  onChange={(e) => handleInputChange('int_memory', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clock Speed (GHz)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.clock_speed}
                  onChange={(e) => handleInputChange('clock_speed', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Camera Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Camera (MP)
                </label>
                <input
                  type="number"
                  value={formData.pc}
                  onChange={(e) => handleInputChange('pc', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front Camera (MP)
                </label>
                <input
                  type="number"
                  value={formData.fc}
                  onChange={(e) => handleInputChange('fc', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Physical Specs */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (g)
                </label>
                <input
                  type="number"
                  value={formData.mobile_wt}
                  onChange={(e) => handleInputChange('mobile_wt', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cores
                </label>
                <input
                  type="number"
                  value={formData.n_cores}
                  onChange={(e) => handleInputChange('n_cores', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Talk Time (hrs)
                </label>
                <input
                  type="number"
                  value={formData.talk_time}
                  onChange={(e) => handleInputChange('talk_time', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Connectivity Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'four_g', label: '4G Support' },
                { key: 'wifi', label: 'WiFi Support' },
                { key: 'blue', label: 'Bluetooth' },
                { key: 'dual_sim', label: 'Dual SIM' }
              ].map((feature) => (
                <div key={feature.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[feature.key as keyof PredictionInput] === 1}
                    onChange={(e) => handleInputChange(feature.key as keyof PredictionInput, e.target.checked ? '1' : '0')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">{feature.label}</label>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={isLoading}
            className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Predict Price Range</span>
              </>
            )}
          </button>
        </div>

        {/* Prediction Results */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
          
          {prediction !== null ? (
            <div className="space-y-6">
              {/* Main Prediction */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Smartphone className={`w-8 h-8 ${priceColors[prediction]}`} />
                  <h3 className="text-2xl font-bold">Price Prediction</h3>
                </div>
                <div className={`inline-block px-6 py-3 rounded-full text-xl font-bold ${priceBgColors[prediction]} ${priceColors[prediction]}`}>
                  {priceLabels[prediction]}
                </div>
              </div>

              {/* Confidence Scores */}
              <div className="space-y-3">
                <h4 className="font-semibold">Confidence Scores</h4>
                {confidence.map((conf, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{priceLabels[index]}</span>
                      <span className="font-medium">{(conf * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-yellow-500' :
                          index === 2 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${conf * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Model Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Model: {trainedModel.type}</div>
                  <div>Accuracy: {(trainedModel.accuracy * 100).toFixed(2)}%</div>
                  <div>Prediction confidence: {(Math.max(...confidence) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter phone specifications and click predict to see the price range estimation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};