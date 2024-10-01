// src/components/HumidityChart.js

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
  Gradient,
  defs,
  Stop,
} from 'recharts';

const HumidityChart = ({ data }) => {
  const [currentHour, setCurrentHour] = useState(null);
  const [minHumidity, setMinHumidity] = useState(null);

  useEffect(() => {
    // Get current hour
    const now = new Date();
    setCurrentHour(now.getHours());

    // Find the minimum humidity point
    if (data && data.length > 0) {
      const minPoint = data.reduce((prev, curr) =>
        curr.humidity < prev.humidity ? curr : prev
      );
      setMinHumidity(minPoint);
    }
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* Remove CartesianGrid to eliminate grey grid lines */}
        <defs>
          <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0288d1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0288d1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          label={{ value: 'Time (Hour)', position: 'insideBottom', offset: -5 }}
          tickFormatter={(tick) => `${tick}:00`}
        />
        <YAxis
          label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft', offset: 10 }}
          domain={[0, 100]}
        />
        <Tooltip formatter={(value) => `${value}%`} />

        {/* Line with gradient fill */}
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="#0288d1"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
          fillOpacity={1}
          fill="url(#colorHumidity)"
        />

        {/* ReferenceDot for the minimum humidity point */}
        {minHumidity && (
          <ReferenceDot
            x={minHumidity.time}
            y={minHumidity.humidity}
            r={6}
            fill="#ff5722"
            stroke="none"
            label={{
              value: `Lowest: ${minHumidity.humidity}%`,
              position: 'top',
              fill: '#ff5722',
              fontSize: 12,
            }}
          />
        )}

        {/* ReferenceLine for the current time */}
        {currentHour !== null && (
          <ReferenceLine
            x={currentHour}
            stroke="#ffab00"
            strokeDasharray="3 3"
            label={{
              value: 'Now',
              position: 'insideTop',
              fill: '#ffab00',
              fontSize: 12,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HumidityChart;
