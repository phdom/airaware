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
} from 'recharts';

const HumidityChart = ({ data }) => {
  const [currentHour, setCurrentHour] = useState(null);
  const [minHumidity, setMinHumidity] = useState(null);
  const [maxHumidity, setMaxHumidity] = useState(null);
  const [yDomain, setYDomain] = useState([0, 100]); // Default Y-axis range

  useEffect(() => {
    // Get current hour and format it as 'HH:00'
    const now = new Date();
    const hour = now.getHours();
    const formattedHour = hour.toString().padStart(2, '0') + ':00';
    setCurrentHour(formattedHour);

    if (data && data.length > 0) {
      const humidityValues = data.map((hourData) => hourData.humidity);
      const minValue = Math.min(...humidityValues);
      const maxValue = Math.max(...humidityValues);

      // Apply padding of ±10, clamped between 0 and 100
      const yMin = Math.max(minValue - 10, 0);
      const yMax = Math.min(maxValue + 10, 100);
      setYDomain([yMin, yMax]);

      // Find the minimum humidity point
      const minPoint = data.reduce((prev, curr) =>
        curr.humidity < prev.humidity ? curr : prev
      );
      setMinHumidity(minPoint);

      // Find the maximum humidity point
      const maxPoint = data.reduce((prev, curr) =>
        curr.humidity > prev.humidity ? curr : prev
      );
      setMaxHumidity(maxPoint);
    }
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        aria-label="Humidity levels throughout the day"
        role="img"
      >
        {/* Define Gradient for the Line Fill */}
        <defs>
          <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0288d1" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0288d1" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* X-Axis Configuration */}
        <XAxis
          dataKey="time"
          label={{ value: 'Time (Hour)', position: 'insideBottom', offset: -5 }}
          tickFormatter={(tick) => tick}
          tick={{ fontSize: 12 }}
          stroke="#666"
        />

        {/* Y-Axis Configuration with Dynamic Range */}
        <YAxis
          label={{
            value: 'Humidity (%)',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            fontSize: 12,
          }}
          domain={yDomain}
          tickFormatter={(tick) => `${tick}%`}
          tick={{ fontSize: 12 }}
          stroke="#666"
        />

        {/* Tooltip Configuration */}
        <Tooltip
          formatter={(value) => `${value}%`}
          labelFormatter={(label) => `Time: ${label}`}
          contentStyle={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          itemStyle={{ color: '#0288d1' }}
        />

        {/* Line Configuration */}
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="#0288d1"
          strokeWidth={2}
          dot={false} // Removes the dots
          activeDot={{ r: 4 }} // Smaller active dots on hover
          isAnimationActive={true}
          fillOpacity={1}
          fill="url(#colorHumidity)"
        />

        {/* ReferenceDot for the Minimum Humidity Point (Green) */}
        {minHumidity && (
          <ReferenceDot
            x={minHumidity.time}
            y={minHumidity.humidity}
            r={5} // Slightly larger for emphasis
            fill="#4caf50" // Green color for low humidity
            stroke="none"
            label={{
              value: `Low: ${minHumidity.humidity}%`,
              position: 'top',
              fill: '#4caf50',
              fontSize: 12,
            }}
          />
        )}

        {/* ReferenceDot for the Maximum Humidity Point (Red) */}
        {maxHumidity && (
          <ReferenceDot
            x={maxHumidity.time}
            y={maxHumidity.humidity}
            r={5} // Slightly larger for emphasis
            fill="#f44336" // Red color for high humidity
            stroke="none"
            label={{
              value: `High: ${maxHumidity.humidity}%`,
              position: 'top',
              fill: '#f44336',
              fontSize: 12,
            }}
          />
        )}

        {/* ReferenceLine for the Current Time */}
        {currentHour && (
          <ReferenceLine
            x={currentHour}
            stroke="#ffab00"
            strokeDasharray="3 3"
            label={{
              value: 'Now',
              position: 'insideTop',
              fill: '#ffab00',
              fontSize: 12,
              offset: 10,
            }}
            isFront={true} // Ensures the line is rendered above other elements
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HumidityChart;
