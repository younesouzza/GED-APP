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
import './userChart.css';

export default function UserChart() {
  // Sample user registration data over time (dates can be daily, weekly, etc.)
  const data = [
    { date: '2025-04-01', registrations: 30 },
    { date: '2025-04-02', registrations: 45 },
    { date: '2025-04-03', registrations: 38 },
    { date: '2025-04-04', registrations: 60 },
    { date: '2025-04-05', registrations: 52 },
    { date: '2025-04-06', registrations: 70 },
    { date: '2025-04-07', registrations: 65 },
  ];

  return (
    <div className='UserChart'>
      <h3 className='chartTitle'>User Registration Chart</h3>

      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
