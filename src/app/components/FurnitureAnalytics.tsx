'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';

const data = [
  { month: 'Jan', balance: 22000, cash: 100000, savings: 250000 },
  { month: 'Feb', balance: 18000, cash: 95000, savings: 230000 },
  { month: 'Mar', balance: 25000, cash: 110000, savings: 270000 },
  { month: 'Apr', balance: 21000, cash: 98000, savings: 240000 },
  { month: 'May', balance: 27000, cash: 115000, savings: 290000 },
  { month: 'Jun', balance: 30000, cash: 120000, savings: 310000 },
];

export default function AnalyticsGraph() {
  return (
    <div className="w-full mx-auto p-6 bg-black shadow-lg  border border-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-400">Financial Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold">Balance</h3>
          <p className="text-2xl font-bold">$22,000</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold">Cash</h3>
          <p className="text-2xl font-bold">$100,000</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold">Savings</h3>
          <p className="text-2xl font-bold">$250,000</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="month" stroke="#f97316" tick={{ fill: '#f97316' }} />
            <YAxis stroke="#f97316" tick={{ fill: '#f97316' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#f97316' }} />
            <Legend verticalAlign="top" height={30} wrapperStyle={{ color: '#f97316' }} />
            <Line type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2.5} />
            <Line type="monotone" dataKey="cash" stroke="#3b82f6" strokeWidth={2.5} />
            <Line type="monotone" dataKey="savings" stroke="#f97316" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="month" stroke="#f97316" tick={{ fill: '#f97316' }} />
            <YAxis stroke="#f97316" tick={{ fill: '#f97316' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#f97316' }} />
            <Legend verticalAlign="top" height={30} wrapperStyle={{ color: '#f97316' }} />
            <Bar dataKey="balance" fill="#22c55e" barSize={30} />
            <Bar dataKey="cash" fill="#3b82f6" barSize={30} />
            <Bar dataKey="savings" fill="#f97316" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
