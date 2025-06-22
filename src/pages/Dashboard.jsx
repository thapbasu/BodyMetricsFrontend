import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { User, TrendingUp, Calendar, Target, Award, Users } from 'lucide-react';
import Layout from "../components/Layout.jsx";
import useAuthStore from '../store/authStore';

const Dashboard = () => {
    const userId = useAuthStore((state) => state.user?.id);
    const [latest, setLatest] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [totalMeasurement, setTotalMeasurement] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/measurements/progress/${userId}`);
                const data = await res.json();
                setLatest(data.latest);
                setProgressData(data.progressData);
                setLastUpdated(data.lastUpdated);
                setTotalMeasurement(data.totalMeasurements);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    const getRelativeTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else if (diffDays < 365) {
            const diffMonths = Math.floor(diffDays / 30);
            return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
        } else {
            const diffYears = Math.floor(diffDays / 365);
            return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
        }
    };

    const bmi = latest?.weight && latest?.height
        ? (latest.weight / ((latest.height / 100) ** 2)).toFixed(1)
        : null;

    const measurementCategories = latest ? [
        { name: 'Upper Body', value: (latest.chest || 0) + (latest.shoulders || 0), color: '#f43f5e' },
        { name: 'Arms', value: (latest.arm || 0) + (latest.forearms || 0), color: '#c4b5fd' },
        { name: 'Core', value: (latest.waist || 0) + (latest.hips || 0), color: '#ffe4e6' },
        { name: 'Legs', value: (latest.thighs || 0) + (latest.calves || 0), color: '#fbbf24' }
    ] : [];

    const MeasurementCard = ({ title, value, unit, icon, trend }) => (
        <div className="w-full bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blush rounded-lg">{icon}</div>
                    <h3 className="font-poppins font-semibold text-gray-800">{title}</h3>
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">{trend > 0 ? '+' : ''}{trend}%</span>
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900">
                {value} <span className="text-lg font-normal text-gray-600">{unit}</span>
            </div>
        </div>
    );

    if (!latest) {
        return (
            <Layout title="Dashboard">
                <div className="text-center mt-20 text-gray-600 text-lg">Loading your dashboard...</div>
            </Layout>
        );
    }

    return (
        <Layout title="Dashboard">
            <div className="min-h-screen bg-gradient-to-br from-blush via-white to-lilac/20 font-poppins px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-lg border-b border-gray-200 rounded-xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                            <div className="text-4xl">👤</div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
                                <p className="text-gray-600 capitalize">Your Dashboard</p>
                            </div>
                        </div>
                        {lastUpdated && (
                            <div className="flex items-center space-x-2 bg-blush px-4 py-2 rounded-lg">
                                <Calendar size={16} className="text-rose" />
                                <span className="text-sm font-medium text-gray-700">
                                    Last Updated: {getRelativeTime(lastUpdated)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <MeasurementCard title="Weight" value={latest.weight} unit="kg" icon={<Target className="text-rose" size={20} />} trend={2.5} />
                    <MeasurementCard title="Height" value={latest.height} unit="cm" icon={<User className="text-rose" size={20} />} />
                    <MeasurementCard title="BMI" value={bmi} unit="" icon={<Award className="text-rose" size={20} />} trend={-1.2} />
                    <MeasurementCard title="Measurements" value={totalMeasurement} unit="tracked" icon={<Users className="text-rose" size={20} />} />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Progress Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Line type="monotone" dataKey="weight" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', strokeWidth: 2, r: 4 }} />
                                <Line type="monotone" dataKey="chest" stroke="#c4b5fd" strokeWidth={3} dot={{ fill: '#c4b5fd', strokeWidth: 2, r: 4 }} />
                                <Line type="monotone" dataKey="waist" stroke="#fbbf24" strokeWidth={3} dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Body Composition</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={measurementCategories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {measurementCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} cm`, 'Total']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {measurementCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{category.value} cm</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Measurements */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Measurements</h2>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {Object.entries(latest).map(([key, value]) => (
                            key !== 'height' && key !== 'weight' && (
                                <div key={key} className="bg-gradient-to-r from-blush to-white rounded-lg p-3 sm:p-4 border border-gray-100 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-800 capitalize text-sm sm:text-base truncate pr-2">{key}</h3>
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rose/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-rose rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                        {value} <span className="text-xs sm:text-sm font-normal text-gray-600">cm</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                        <div
                                            className="bg-gradient-to-r from-rose to-lilac h-1.5 sm:h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((value / 50) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;