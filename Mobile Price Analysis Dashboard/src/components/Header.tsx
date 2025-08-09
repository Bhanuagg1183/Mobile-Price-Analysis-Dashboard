import React from 'react';
import { Smartphone, Brain, TrendingUp } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PhonePrice AI
                </h1>
                <p className="text-sm text-gray-600">Machine Learning Price Prediction</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Brain className="w-4 h-4" />
              <span>ML-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Real-time Predictions</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};