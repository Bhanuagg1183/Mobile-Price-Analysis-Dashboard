import React, { useRef, useEffect } from 'react';

interface ChartProps {
  type: 'bar' | 'line' | 'pie';
  data: number[];
  labels: string[];
  color?: string;
  colors?: string[];
  width?: number;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ 
  type, 
  data, 
  labels, 
  color = 'rgba(59, 130, 246, 0.8)',
  colors,
  width = 600,
  height = 300 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    if (type === 'bar') {
      drawBarChart(ctx, data, labels, color, padding, chartWidth, chartHeight);
    } else if (type === 'pie') {
      drawPieChart(ctx, data, labels, colors || [], canvas.width / 2, canvas.height / 2, Math.min(chartWidth, chartHeight) / 2 - 20);
    } else if (type === 'line') {
      drawLineChart(ctx, data, labels, color, padding, chartWidth, chartHeight);
    }
  }, [type, data, labels, color, colors]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D, 
    data: number[], 
    labels: string[], 
    color: string,
    padding: number,
    chartWidth: number,
    chartHeight: number
  ) => {
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = padding + chartHeight - barHeight;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value labels
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });

    // Draw labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '11px Inter, sans-serif';
    labels.forEach((label, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
      const y = padding + chartHeight + 20;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = 'right';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
  };

  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    labels: string[],
    colors: string[],
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;
    
    const defaultColors = [
      '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'
    ];

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const sliceColor = colors[index] || defaultColors[index % defaultColors.length];

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = sliceColor;
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${((value / total) * 100).toFixed(1)}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Draw legend
    labels.forEach((label, index) => {
      const legendY = 30 + index * 25;
      const legendColor = colors[index] || defaultColors[index % defaultColors.length];
      
      ctx.fillStyle = legendColor;
      ctx.fillRect(20, legendY - 10, 15, 15);
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 45, legendY + 2);
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    labels: string[],
    color: string,
    padding: number,
    chartWidth: number,
    chartHeight: number
  ) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const pointSpacing = chartWidth / (data.length - 1);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="max-w-full h-auto border border-gray-200 rounded-lg"
      />
    </div>
  );
};