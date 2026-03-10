import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { TrendingUp } from 'lucide-react';

const GraphMarketAnalytics = () => {
  const marketData = [
    { year: '2023', value: 1.44 },
    { year: '2024', value: 1.93 },
    { year: '2025', value: 2.58 },
    { year: '2026', value: 3.46 },
    { year: '2027', value: 4.63 },
    { year: '2028', value: 6.20 },
    { year: '2029', value: 8.30 },
    { year: '2030', value: 11.12 },
    { year: '2031', value: 14.89 },
    { year: '2032', value: 26.73 },
  ];

  const CAGR = "33.90%";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="max-w-5xl w-full bg-white p-6 shadow-xl border border-gray-200 rounded-lg">
        
        {/* Header Section */}
        <div className="text-center mb-10 border-b-2 border-orange-400 pb-6">
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#1e40af] uppercase tracking-tight">
            Global Graph Analytics Market
          </h1>
          <p className="text-lg md:text-xl italic text-blue-500 mt-2 font-medium">
            Market Size, Share, Trends Analysis Report, 2024 – 2032 (USD Billion)
          </p>
        </div>

        {/* Stats Highlight */}
        <div className="flex justify-between items-center mb-8 px-4">
          <div className="bg-[#1e40af] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
            <TrendingUp size={24} />
            <span className="font-bold text-lg md:text-xl">CAGR: {CAGR}</span>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Growth Projection</p>
            <p className="text-2xl font-black text-blue-900">↑ EXPONENTIAL</p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[450px] w-full pr-4 relative">
            {/* Vertical Y-Axis Title */}
            <div className="absolute -left-12 top-1/2 -rotate-90 text-gray-400 font-bold text-xs uppercase tracking-widest">
                Revenue (USD Billion)
            </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketData} margin={{ top: 30, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                axisLine={{ stroke: '#cbd5e1' }} 
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
                dy={10}
              />
              <YAxis hide domain={[0, 30]} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {marketData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.year === '2032' ? '#1d4ed8' : '#3b82f6'} 
                    className="hover:fill-orange-400 transition-colors duration-300"
                  />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  formatter={(val) => `$${val}`}
                  style={{ fill: '#1e40af', fontSize: '12px', fontWeight: 'bold' }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-8 w-8 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold">Z</div>
            <span className="font-black text-xl text-gray-800 tracking-tighter">ZION <span className="text-blue-600">MARKET RESEARCH</span></span>
          </div>
          <p className="text-gray-400 text-sm font-medium">
            Source: <span className="text-blue-800 font-bold">Zion Market Research Analysis</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GraphMarketAnalytics;