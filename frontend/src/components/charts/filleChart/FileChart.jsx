import './fileChart.css'
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function FileChart() {
  const data = [
    { date: '2025-04-01', uploads: 5 },
    { date: '2025-04-02', uploads: 12 },
    { date: '2025-04-03', uploads: 8 },
    { date: '2025-04-04', uploads: 15 },
    { date: '2025-04-05', uploads: 10 },
    { date: '2025-04-06', uploads: 18 },
    { date: '2025-04-07', uploads: 13 },
  ];

  return (
    <div className='UserChart'>
      <h3 className='chartTitle'>File Upload Tracking Chart</h3>

      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="uploads"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
