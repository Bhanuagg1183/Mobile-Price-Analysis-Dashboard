import React, { useState, useEffect } from 'react';
import { PhoneDataset } from '../types/dataset';
import { BarChart3, PieChart, Database, TrendingUp } from 'lucide-react';
import { Chart } from './Chart';
import { calculateCorrelations, getFeatureStats } from '../utils/dataAnalysis';

interface DataExplorerProps {
  dataset: PhoneDataset[];
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ dataset }) => {
  const [selectedFeature, setSelectedFeature] = useState('battery_power');
  const [correlations, setCorrelations] = useState<any>({});
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    if (dataset.length > 0) {
      setCorrelations(calculateCorrelations(dataset));
      setStats(getFeatureStats(dataset));
    }
  }, [dataset]);

  const features = [
    { key: 'battery_power', label: 'Battery Power (mAh)', type: 'numeric' },
    { key: 'ram', label: 'RAM (MB)', type: 'numeric' },
    { key: 'int_memory', label: 'Internal Memory (GB)', type: 'numeric' },
    { key: 'pc', label: 'Primary Camera (MP)', type: 'numeric' },
    { key: 'fc', label: 'Front Camera (MP)', type: 'numeric' },
    { key: 'mobile_wt', label: 'Weight (g)', type: 'numeric' },
    { key: 'clock_speed', label: 'Clock Speed (GHz)', type: 'numeric' },
    { key: 'four_g', label: '4G Support', type: 'binary' },
    { key: 'wifi', label: 'WiFi Support', type: 'binary' },
    { key: 'blue', label: 'Bluetooth Support', type: 'binary' }
  ];

  const priceRangeLabels = ['Low Cost', 'Medium Cost', 'High Cost', 'Very High Cost'];
  const priceDistribution = [0, 1, 2, 3].map(range => 
    dataset.filter(item => item.price_range === range).length
  );

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-semibold text-gray-800">Total Records</h3>
              <p className="text-2xl font-bold text-blue-600">{dataset.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-gray-800">Features</h3>
              <p className="text-2xl font-bold text-green-600">20</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-gray-800">Price Classes</h3>
              <p className="text-2xl font-bold text-purple-600">4</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="font-semibold text-gray-800">Balanced</h3>
              <p className="text-2xl font-bold text-orange-600">✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Price Range Distribution</h3>
        <Chart 
          type="bar"
          data={priceDistribution}
          labels={priceRangeLabels}
          color="rgba(59, 130, 246, 0.8)"
        />
      </div>

      {/* Feature Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Feature Distribution</h3>
          <div className="mb-4">
            <select 
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {features.map(feature => (
                <option key={feature.key} value={feature.key}>
                  {feature.label}
                </option>
              ))}
            </select>
          </div>
          {stats[selectedFeature] && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mean:</span>
                <span className="font-medium">{stats[selectedFeature].mean.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Std Dev:</span>
                <span className="font-medium">{stats[selectedFeature].std.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Min:</span>
                <span className="font-medium">{stats[selectedFeature].min}</span>
              </div>
              <div className="flex justify-between">
                <span>Max:</span>
                <span className="font-medium">{stats[selectedFeature].max}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Feature Correlations with Price</h3>
          <div className="space-y-3">
            {Object.entries(correlations)
              .filter(([key]) => key !== 'price_range')
              .sort(([,a], [,b]) => Math.abs(b as number) - Math.abs(a as number))
              .slice(0, 8)
              .map(([feature, correlation]) => (
                <div key={feature} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {feature.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (correlation as number) > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.abs(correlation as number) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {(correlation as number).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sample Data Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Sample Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2">Battery</th>
                <th className="text-left p-2">RAM</th>
                <th className="text-left p-2">Memory</th>
                <th className="text-left p-2">Camera</th>
                <th className="text-left p-2">4G</th>
                <th className="text-left p-2">WiFi</th>
                <th className="text-left p-2">Price Range</th>
              </tr>
            </thead>
            <tbody>
              {dataset.slice(0, 10).map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-2">{item.battery_power}</td>
                  <td className="p-2">{item.ram}</td>
                  <td className="p-2">{item.int_memory}</td>
                  <td className="p-2">{item.pc}</td>
                  <td className="p-2">{item.four_g ? '✓' : '✗'}</td>
                  <td className="p-2">{item.wifi ? '✓' : '✗'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.price_range === 0 ? 'bg-green-100 text-green-800' :
                      item.price_range === 1 ? 'bg-yellow-100 text-yellow-800' :
                      item.price_range === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {priceRangeLabels[item.price_range]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};