import { PhoneDataset } from '../types/dataset';

export const generateSampleData = (count: number): PhoneDataset[] => {
  const data: PhoneDataset[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate correlated features based on price range
    const priceRange = Math.floor(Math.random() * 4);
    
    // Base ranges for each price category
    const ranges = {
      0: { // Low cost
        battery_power: [1500, 3000],
        ram: [1024, 3072],
        int_memory: [8, 32],
        pc: [5, 12],
        fc: [2, 8],
        clock_speed: [1.0, 2.2],
        mobile_wt: [140, 200],
        px_height: [800, 1600],
        px_width: [480, 900],
        sc_h: [10, 14],
        sc_w: [5, 7],
        talk_time: [8, 15],
        n_cores: [1, 4]
      },
      1: { // Medium cost
        battery_power: [2500, 4000],
        ram: [2048, 4096],
        int_memory: [16, 64],
        pc: [8, 16],
        fc: [5, 12],
        clock_speed: [1.8, 2.8],
        mobile_wt: [130, 180],
        px_height: [1200, 2000],
        px_width: [720, 1200],
        sc_h: [12, 16],
        sc_w: [6, 8],
        talk_time: [12, 20],
        n_cores: [2, 6]
      },
      2: { // High cost
        battery_power: [3000, 5000],
        ram: [3072, 8192],
        int_memory: [32, 128],
        pc: [12, 24],
        fc: [8, 16],
        clock_speed: [2.2, 3.2],
        mobile_wt: [120, 160],
        px_height: [1600, 2400],
        px_width: [900, 1440],
        sc_h: [14, 18],
        sc_w: [7, 9],
        talk_time: [15, 25],
        n_cores: [4, 8]
      },
      3: { // Very high cost
        battery_power: [4000, 6000],
        ram: [6144, 16384],
        int_memory: [64, 512],
        pc: [20, 108],
        fc: [12, 40],
        clock_speed: [2.8, 4.0],
        mobile_wt: [100, 150],
        px_height: [2000, 3200],
        px_width: [1200, 1600],
        sc_h: [16, 20],
        sc_w: [8, 10],
        talk_time: [20, 30],
        n_cores: [6, 8]
      }
    };

    const range = ranges[priceRange as keyof typeof ranges];
    
    // Generate random values within the range for this price category
    const battery_power = Math.floor(Math.random() * (range.battery_power[1] - range.battery_power[0]) + range.battery_power[0]);
    const ram = Math.floor(Math.random() * (range.ram[1] - range.ram[0]) + range.ram[0]);
    const int_memory = Math.floor(Math.random() * (range.int_memory[1] - range.int_memory[0]) + range.int_memory[0]);
    const pc = Math.floor(Math.random() * (range.pc[1] - range.pc[0]) + range.pc[0]);
    const fc = Math.floor(Math.random() * (range.fc[1] - range.fc[0]) + range.fc[0]);
    const clock_speed = parseFloat((Math.random() * (range.clock_speed[1] - range.clock_speed[0]) + range.clock_speed[0]).toFixed(1));
    const mobile_wt = Math.floor(Math.random() * (range.mobile_wt[1] - range.mobile_wt[0]) + range.mobile_wt[0]);
    const px_height = Math.floor(Math.random() * (range.px_height[1] - range.px_height[0]) + range.px_height[0]);
    const px_width = Math.floor(Math.random() * (range.px_width[1] - range.px_width[0]) + range.px_width[0]);
    const sc_h = parseFloat((Math.random() * (range.sc_h[1] - range.sc_h[0]) + range.sc_h[0]).toFixed(1));
    const sc_w = parseFloat((Math.random() * (range.sc_w[1] - range.sc_w[0]) + range.sc_w[0]).toFixed(1));
    const talk_time = Math.floor(Math.random() * (range.talk_time[1] - range.talk_time[0]) + range.talk_time[0]);
    const n_cores = Math.floor(Math.random() * (range.n_cores[1] - range.n_cores[0]) + range.n_cores[0]);

    // Binary features (more likely to be present in higher price ranges)
    const blue = Math.random() < (0.5 + priceRange * 0.1) ? 1 : 0;
    const dual_sim = Math.random() < (0.4 + priceRange * 0.1) ? 1 : 0;
    const four_g = Math.random() < (0.3 + priceRange * 0.2) ? 1 : 0;
    const three_g = Math.random() < (0.7 + priceRange * 0.1) ? 1 : 0;
    const touch_screen = Math.random() < (0.8 + priceRange * 0.05) ? 1 : 0;
    const wifi = Math.random() < (0.6 + priceRange * 0.1) ? 1 : 0;

    // Physical dimensions
    const m_deep = parseFloat((Math.random() * 0.5 + 0.5).toFixed(1));

    data.push({
      battery_power,
      blue,
      clock_speed,
      dual_sim,
      fc,
      four_g,
      int_memory,
      m_deep,
      mobile_wt,
      n_cores,
      pc,
      px_height,
      px_width,
      ram,
      sc_h,
      sc_w,
      talk_time,
      three_g,
      touch_screen,
      wifi,
      price_range: priceRange
    });
  }

  return data;
};