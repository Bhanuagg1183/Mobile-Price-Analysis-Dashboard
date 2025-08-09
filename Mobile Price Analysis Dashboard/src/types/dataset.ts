export interface PhoneDataset {
  battery_power: number;
  blue: number;
  clock_speed: number;
  dual_sim: number;
  fc: number;
  four_g: number;
  int_memory: number;
  m_deep: number;
  mobile_wt: number;
  n_cores: number;
  pc: number;
  px_height: number;
  px_width: number;
  ram: number;
  sc_h: number;
  sc_w: number;
  talk_time: number;
  three_g: number;
  touch_screen: number;
  wifi: number;
  price_range: number;
}

export interface TrainedModel {
  type: 'randomForest' | 'decisionTree' | 'svm';
  accuracy: number;
  predictions: number[];
  actualValues: number[];
  confusionMatrix: number[][];
  featureImportance: { feature: string; importance: number; }[];
  crossValidationScores: number[];
  trainingTime: number;
  model: any; // The actual trained model
}

export interface ModelMetrics {
  accuracy: number;
  precision: number[];
  recall: number[];
  f1Score: number[];
  confusionMatrix: number[][];
}

export interface PredictionInput {
  battery_power: number;
  blue: number;
  clock_speed: number;
  dual_sim: number;
  fc: number;
  four_g: number;
  int_memory: number;
  m_deep: number;
  mobile_wt: number;
  n_cores: number;
  pc: number;
  px_height: number;
  px_width: number;
  ram: number;
  sc_h: number;
  sc_w: number;
  talk_time: number;
  three_g: number;
  touch_screen: number;
  wifi: number;
}