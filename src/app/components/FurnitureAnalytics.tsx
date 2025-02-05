'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';

const initialData = [
  { month: 'Jan', products: 400, consumers: 240, cosmetic: 300 },
  { month: 'Feb', products: 500, consumers: 320, cosmetic: 380 },
  { month: 'Mar', products: 600, consumers: 400, cosmetic: 450 },
  { month: 'Apr', products: 700, consumers: 450, cosmetic: 520 },
  { month: 'May', products: 800, consumers: 500, cosmetic: 600 },
  { month: 'Jun', products: 900, consumers: 600, cosmetic: 680 },
];

export default function AnalyticsGraph() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = currentData.map(item => ({
          ...item,
          products: item.products + Math.floor(Math.random() * 50),
          consumers: item.consumers + Math.floor(Math.random() * 30),
          cosmetic: item.cosmetic + Math.floor(Math.random() * 40),
        }));
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-r from-pink-50 to-white shadow-2xl rounded-2xl border border-pink-200">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-600 tracking-wide font-[Inter]">
        Products & Categories Growth
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="5 5" stroke="#fbcfe8" />
          <XAxis 
            dataKey="month" 
            stroke="#be185d"
            tick={{ fill: '#be185d', fontSize: 14, fontWeight: 'bold' }}
            axisLine={{ stroke: "#be185d", strokeWidth: 2 }}
          />
          <YAxis 
            stroke="#be185d"
            tick={{ fill: '#be185d', fontSize: 14, fontWeight: 'bold' }}
            axisLine={{ stroke: "#be185d", strokeWidth: 2 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #fbcfe8',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              padding: '12px',
              color: '#be185d'
            }}
            itemStyle={{ color: '#be185d', fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="top" 
            height={40}
            iconType="circle"
            wrapperStyle={{ fontSize: 14, fontWeight: 'bold', color: '#be185d' }}
          />
          <Line 
            type="monotone" 
            dataKey="products" 
            stroke="#22c55e" // Green
            strokeWidth={3.5}
            dot={{ fill: '#22c55e', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="consumers" 
            stroke="#3b82f6" // Blue
            strokeWidth={3.5}
            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="cosmetic" 
            stroke="#ec4899" // Pink
            strokeWidth={3.5}
            dot={{ fill: '#ec4899', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
