import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Area, AreaChart
} from 'recharts';
import {
    TrendingUp, TrendingDown, ChevronDown, ChevronUp,
    Trophy, Flame, Clock, Activity
} from 'lucide-react';
import Layout from "../components/Layout.jsx";

const measurementColors = {
    weight: '#f43f5e', chest: '#8b5cf6', waist: '#f59e0b', hips: '#10b981',
    thighs: '#3b82f6', arms: '#ef4444',
    shoulders: '#6366f1', forearms: '#14b8a6',
    calves: '#f97316', neck: '#84cc16', height: '#0ea5e9'
};

// Mock data for demonstration
const mockProgressData = [
    { date: 'Jan 2024', weight: 70, chest: 95, waist: 80, hips: 90, thighs: 55, arms: 35 },
    { date: 'Feb 2024', weight: 72, chest: 97, waist: 78, hips: 92, thighs: 56, arms: 36 },
    { date: 'Mar 2024', weight: 74, chest: 99, waist: 76, hips: 94, thighs: 57, arms: 37 },
    { date: 'Apr 2024', weight: 75, chest: 101, waist: 75, hips: 95, thighs: 58, arms: 38 },
    { date: 'May 2024', weight: 77, chest: 103, waist: 74, hips: 96, thighs: 59, arms: 39 },
    { date: 'Jun 2024', weight: 78, chest: 105, waist: 73, hips: 97, thighs: 60, arms: 40 }
];

const ProgressAnalytics = () => {
    const allMeasurements = Object.keys(measurementColors);
    const [progressData, setProgressData] = useState(mockProgressData);
    const [selectedMeasurements, setSelectedMeasurements] = useState(['weight', 'chest', 'waist']);
    const [viewType, setViewType] = useState('line');
    const [timeRange, setTimeRange] = useState('all');
    const [showInsights, setShowInsights] = useState(true);

    const insights = useMemo(() => {
        const insights = [];

        allMeasurements.forEach(measurement => {
            const values = progressData.map(d => d[measurement]).filter(v => v != null);
            if (values.length < 2) return;

            const firstValue = values[0];
            const lastValue = values[values.length - 1];
            const totalChange = lastValue - firstValue;
            const percentChange = ((totalChange / firstValue) * 100).toFixed(1);

            let maxGrowth = 0;
            let bestPeriod = '';
            for (let i = 1; i < progressData.length; i++) {
                const current = progressData[i][measurement];
                const previous = progressData[i - 1][measurement];
                if (current != null && previous != null) {
                    const growth = current - previous;
                    if (growth > maxGrowth) {
                        maxGrowth = growth;
                        bestPeriod = progressData[i].date;
                    }
                }
            }

            insights.push({
                measurement,
                totalChange,
                percentChange,
                bestPeriod,
                maxGrowth,
                trend: totalChange > 0 ? 'up' : 'down'
            });
        });

        return insights.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
    }, [progressData]);

    const filteredData = useMemo(() => {
        if (timeRange === 'all') return progressData;
        const monthsToShow = timeRange === '6m' ? 6 : 12;
        return progressData.slice(-monthsToShow);
    }, [timeRange, progressData]);

    const handleMeasurementToggle = (measurement) => {
        setSelectedMeasurements(prev =>
            prev.includes(measurement)
                ? prev.filter(m => m !== measurement)
                : [...prev, measurement]
        );
    };

    const StatCard = ({ icon, title, value, subtitle, trend }) => (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-red-500 min-h-[120px] sm:min-h-[140px]">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                        {React.cloneElement(icon, { size: 16, className: "sm:w-5 sm:h-5" })}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight truncate">{title}</h3>
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 flex-shrink-0 ml-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? <TrendingUp size={14} className="sm:w-4 sm:h-4" /> : <TrendingDown size={14} className="sm:w-4 sm:h-4" />}
                    </div>
                )}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">{value}</div>
            <div className="text-xs sm:text-sm text-gray-600 leading-tight">{subtitle}</div>
        </div>
    );

    const InsightCard = ({ insight }) => (
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 capitalize text-sm sm:text-base truncate flex-1 pr-2">{insight.measurement}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    insight.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {insight.percentChange > 0 ? '+' : ''}{insight.percentChange}%
                </div>
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Total change:</span>
                    <span className="font-medium">{insight.totalChange > 0 ? '+' : ''}{insight.totalChange}cm</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Best growth:</span>
                    <span className="font-medium">{insight.bestPeriod} (+{insight.maxGrowth}cm)</span>
                </div>
            </div>
        </div>
    );

    return (
        <Layout title="Progress Analytics">
            <div className="min-h-screen bg-gradient-to-br from-blush via-white to-lilac/20 font-poppins px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white shadow-lg border-b border-gray-200 rounded-xl p-6 mb-8">
                    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Progress Analytics</h1>
                        <p className="text-sm sm:text-base text-gray-600">Comprehensive analysis of your fitness journey</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                        >
                            <option value="all">All Time</option>
                            <option value="12m">Last 12 Months</option>
                            <option value="6m">Last 6 Months</option>
                        </select>

                        <select
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                        >
                            <option value="line">Line Chart</option>
                            <option value="area">Area Chart</option>
                            <option value="bar">Bar Chart</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <StatCard
                    icon={<Trophy className="text-red-600" />}
                    title="Best Performer"
                    value={insights[0]?.measurement || 'N/A'}
                    subtitle={`${insights[0]?.percentChange || 0}% improvement`}
                    trend={insights[0]?.trend}
                />
                <StatCard
                    icon={<Flame className="text-orange-600" />}
                    title="Fastest Growth"
                    value={`${insights[0]?.maxGrowth || 0}cm`}
                    subtitle={`in ${insights[0]?.bestPeriod || 'N/A'}`}
                    trend="up"
                />
                <StatCard
                    icon={<Clock className="text-blue-600" />}
                    title="Time Period"
                    value={`${filteredData.length} months`}
                    subtitle="Data analyzed"
                />
                <StatCard
                    icon={<Activity className="text-green-600" />}
                    title="Measurements"
                    value={allMeasurements.length}
                    subtitle="Body parts tracked"
                />
            </div>

            {/* Measurement Selector */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Measurements</h2>
                    <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                        {selectedMeasurements.length} of {allMeasurements.length} selected
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:flex xl:flex-wrap gap-2">
                    {allMeasurements.map(measurement => (
                        <button
                            key={measurement}
                            onClick={() => handleMeasurementToggle(measurement)}
                            className={`px-2 sm:px-3 lg:px-4 py-2 rounded-lg border transition-all text-xs sm:text-sm lg:text-base ${
                                selectedMeasurements.includes(measurement)
                                    ? 'bg-red-300 text-white border-red-300 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                            }`}
                        >
                            <div className="flex items-center justify-center xl:justify-start space-x-1 sm:space-x-2">
                                <div
                                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: measurementColors[measurement] }}
                                />
                                <span className="capitalize truncate">{measurement}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Graph */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Progress Over Time</h2>
                <div className="w-[90%] mx-auto overflow-hidden">
                    <ResponsiveContainer width="100%" height={300} className="sm:!h-80 lg:!h-96">
                        {viewType === 'line' && (
                            <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#666"
                                    angle={-45}
                                    textAnchor="end"
                                    tick={{ fontSize: 10 }}
                                    className="sm:text-xs"
                                    interval={0}
                                    height={60}
                                />
                                <YAxis stroke="#666" tick={{ fontSize: 10 }} className="sm:text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: '12px',
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}
                                />
                                {selectedMeasurements.map(measurement => (
                                    <Line
                                        key={measurement}
                                        type="monotone"
                                        dataKey={measurement}
                                        stroke={measurementColors[measurement]}
                                        strokeWidth={2}
                                        dot={{ fill: measurementColors[measurement], strokeWidth: 2, r: 3 }}
                                        className="sm:stroke-[3px] sm:dot:r-4"
                                    />
                                ))}
                            </LineChart>
                        )}
                        {viewType === 'area' && (
                            <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} className="sm:text-xs" />
                                <YAxis stroke="#666" tick={{ fontSize: 10 }} className="sm:text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: '12px',
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}
                                />
                                {selectedMeasurements.map(measurement => (
                                    <Area
                                        key={measurement}
                                        type="monotone"
                                        dataKey={measurement}
                                        stackId="1"
                                        stroke={measurementColors[measurement]}
                                        fill={measurementColors[measurement]}
                                        fillOpacity={0.3}
                                    />
                                ))}
                            </AreaChart>
                        )}
                        {viewType === 'bar' && (
                            <BarChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 10 }} className="sm:text-xs" />
                                <YAxis stroke="#666" tick={{ fontSize: 10 }} className="sm:text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        fontSize: '12px',
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}
                                />
                                {selectedMeasurements.map(measurement => (
                                    <Bar
                                        key={measurement}
                                        dataKey={measurement}
                                        fill={measurementColors[measurement]}
                                        opacity={0.8}
                                    />
                                ))}
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Detailed Insights</h2>
                    <button
                        onClick={() => setShowInsights(!showInsights)}
                        className="flex items-center space-x-1 sm:space-x-2 text-red-600 hover:text-red-700 text-sm sm:text-base"
                    >
                        <span>{showInsights ? 'Hide' : 'Show'} Details</span>
                        {showInsights ? <ChevronUp size={14} className="sm:w-4 sm:h-4" /> : <ChevronDown size={14} className="sm:w-4 sm:h-4" />}
                    </button>
                </div>
                {showInsights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {insights.map((insight, index) => (
                            <InsightCard key={index} insight={insight} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        </Layout>
    );
};

export default ProgressAnalytics;