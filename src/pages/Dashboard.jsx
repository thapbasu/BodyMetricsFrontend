import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Calendar, Ruler, Weight } from 'lucide-react';
import Layout from "../components/Layout.jsx";
import useAuthStore from '../store/authStore.js';

const FitnessDashboard = () => {
  const userId =useAuthStore((state) => state.user?.id);
  const [latest, setLatest] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [totalMeasurement, setTotalMeasurement] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/measurements/progress/${userId}`);
        const data = await res.json();
        console.log('data', data);
        setLatest(data.latest);
        setProgressData(data.progressData);
        setLastUpdated(data.lastUpdated);
        setTotalMeasurement(data.totalMeasurements);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const metrics = [
    { key: 'weight', label: 'Weight', unit: 'kg', icon: Weight },
    { key: 'height', label: 'Height', unit: 'ft', icon: Ruler },
    { key: 'chest', label: 'Chest', unit: 'in' },
    { key: 'waist', label: 'Waist', unit: 'in' },
    { key: 'thighs', label: 'Thighs', unit: 'in' },
    { key: 'arms', label: 'Arms', unit: 'in' },
    { key: 'shoulders', label: 'Shoulders', unit: 'in' },
    { key: 'calves', label: 'Calves', unit: 'in' },
    { key: 'forearms', label: 'Forearms', unit: 'in' },
    { key: 'neck', label: 'Neck', unit: 'in' },
    { key: 'hips', label: 'Hips', unit: 'in' }
  ];

  const calculateChange = (metric) => {
    if (progressData.length < 2) return 0;
    const first = progressData[0][metric];
    const last = progressData[progressData.length - 1][metric];
    return ((last - first) / first * 100).toFixed(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-slate-600">Loading your progress...</div>
        </div>
      </Layout>
    );
  }

  if (!latest) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-600">No measurement data available</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Fitness Dashboard</h1>
            <div className="flex items-center gap-4 text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Last updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">{totalMeasurement} total measurements</span>
              </div>
            </div>
          </div>

          {/* Latest Measurements Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric) => {
              const change = calculateChange(metric.key);
              const Icon = metric.icon || TrendingUp;
              return (
                <div
                  key={metric.key}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200"
                  onClick={() => setSelectedMetric(metric.key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    {latest[metric.key]}
                    <span className="text-lg text-slate-500 ml-1">{metric.unit}</span>
                  </div>
                  {progressData.length > 1 && (
                    <div className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '+' : ''}{change}% from start
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Progress Chart</h2>
              <div className="flex flex-wrap gap-2">
                {metrics.map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedMetric === metric.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#64748b"
                />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                  name={metrics.find(m => m.key === selectedMetric)?.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Recent Progress Summary</h2>
            {progressData.length >= 2 && (
              <div className="text-sm text-slate-600 mb-4">
                Comparing: {formatDate(progressData[progressData.length - 2].date)} → {formatDate(progressData[progressData.length - 1].date)}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric) => {
                const secondLast = progressData.length >= 2 ? progressData[progressData.length - 2]?.[metric.key] : null;
                const last = progressData[progressData.length - 1]?.[metric.key];
                const change = secondLast && last ? (((last - secondLast) / secondLast) * 100).toFixed(1) : 0;
                
                return (
                  <div key={metric.key} className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-slate-600 mb-2">{metric.label}</div>
                    {progressData.length >= 2 ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold text-slate-800">{secondLast} {metric.unit}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-lg font-semibold text-slate-800">{last} {metric.unit}</span>
                        </div>
                        <div className={`text-sm font-medium mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change >= 0 ? '+' : ''}{change}% change
                        </div>
                      </>
                    ) : (
                      <div className="text-lg font-semibold text-slate-800">{last} {metric.unit}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FitnessDashboard;