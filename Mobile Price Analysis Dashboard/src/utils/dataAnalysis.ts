import { PhoneDataset } from '../types/dataset';

export const calculateCorrelations = (dataset: PhoneDataset[]) => {
  const features = Object.keys(dataset[0]) as (keyof PhoneDataset)[];
  const correlations: { [key: string]: number } = {};

  features.forEach(feature => {
    if (feature === 'price_range') return;
    
    const featureValues = dataset.map(item => item[feature]);
    const priceValues = dataset.map(item => item.price_range);
    
    correlations[feature] = pearsonCorrelation(featureValues, priceValues);
  });

  return correlations;
};

export const getFeatureStats = (dataset: PhoneDataset[]) => {
  const features = Object.keys(dataset[0]) as (keyof PhoneDataset)[];
  const stats: { [key: string]: any } = {};

  features.forEach(feature => {
    const values = dataset.map(item => item[feature]);
    
    stats[feature] = {
      mean: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      std: Math.sqrt(
        values.reduce((sum, val) => {
          const mean = values.reduce((s, v) => s + v, 0) / values.length;
          return sum + Math.pow(val - mean, 2);
        }, 0) / values.length
      )
    };
  });

  return stats;
};

const pearsonCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};