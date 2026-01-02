import React, { useState } from 'react';
import Layout from '../components/Layout.jsx';
import useAuthStore from '../store/authStore';
import { Weight, Ruler, User, Calendar, Check, X } from 'lucide-react';

const AddMeasurementForm = ({ onAddSuccess }) => {
    const userId = useAuthStore((state) => state.user?.id);
    const [selectedDate, setSelectedDate] = useState('');
    const [form, setForm] = useState({
        weight: '',
        height: '',
        chest: '',
        waist: '',
        arms: '',
        thighs: '',
        calves: '',
        shoulders: '',
        forearms: '',
        neck: '',
        hips: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!selectedDate) {
            setError('Please select a date.');
            return;
        }
        if (!form.weight) {
            setError('Weight is required.');
            return;
        }

        setLoading(true);

        const payload = {
            month: selectedDate,
            weight: Number(form.weight),
            height: form.height ? Number(form.height) : undefined,
            chest: form.chest ? Number(form.chest) : undefined,
            waist: form.waist ? Number(form.waist) : undefined,
            arms: form.arms ? Number(form.arms) : undefined,
            thighs: form.thighs ? Number(form.thighs) : undefined,
            calves: form.calves ? Number(form.calves) : undefined,
            shoulders: form.shoulders ? Number(form.shoulders) : undefined,
            forearms: form.forearms ? Number(form.forearms) : undefined,
            neck: form.neck ? Number(form.neck) : undefined,
            hips: form.hips ? Number(form.hips) : undefined,
        };

        try {
            const res = await fetch(`http://localhost:3000/api/measurements/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add measurement');

            setSuccess('Measurement added successfully!');
            setForm({
                weight: '',
                height: '',
                chest: '',
                waist: '',
                arms: '',
                thighs: '',
                calves: '',
                shoulders: '',
                forearms: '',
                neck: '',
                hips: '',
            });
            setSelectedDate('');

            if (onAddSuccess) onAddSuccess(data);
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const measurementGroups = [
        {
            title: 'Essential Measurements',
            icon: Weight,
            fields: [
                { name: 'weight', label: 'Weight', unit: 'kg', required: true, placeholder: 'e.g., 70.5' },
                { name: 'height', label: 'Height', unit: 'ft', required: false, placeholder: 'e.g., 5.8' },
            ]
        },
        {
            title: 'Upper Body',
            icon: User,
            fields: [
                { name: 'chest', label: 'Chest', unit: 'in', placeholder: 'e.g., 38' },
                { name: 'shoulders', label: 'Shoulders', unit: 'in', placeholder: 'e.g., 45' },
                { name: 'arms', label: 'Arms', unit: 'in', placeholder: 'e.g., 14' },
                { name: 'forearms', label: 'Forearms', unit: 'in', placeholder: 'e.g., 11' },
                { name: 'neck', label: 'Neck', unit: 'in', placeholder: 'e.g., 15' },
            ]
        },
        {
            title: 'Lower Body',
            icon: Ruler,
            fields: [
                { name: 'waist', label: 'Waist', unit: 'in', placeholder: 'e.g., 32' },
                { name: 'hips', label: 'Hips', unit: 'in', placeholder: 'e.g., 38' },
                { name: 'thighs', label: 'Thighs', unit: 'in', placeholder: 'e.g., 22' },
                { name: 'calves', label: 'Calves', unit: 'in', placeholder: 'e.g., 15' },
            ]
        }
    ];

    return (
        <Layout title="Add New Measurement">
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
                <main className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Add New Measurement</h1>
                        <p className="text-slate-600">Track your progress by recording your body measurements</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-800">Error</p>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}
                    
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-800">Success!</p>
                                <p className="text-green-700">{success}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Measurement Date</h2>
                                    <p className="text-sm text-slate-600">Select when you took these measurements</p>
                                </div>
                            </div>
                            <input
                                id="date"
                                type="date"
                                value={selectedDate}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {measurementGroups.map((group) => {
                            const Icon = group.icon;
                            return (
                                <div key={group.title} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800">{group.title}</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {group.fields.map((field) => (
                                            <div key={field.name}>
                                                <label htmlFor={field.name} className="block mb-2 font-medium text-slate-700">
                                                    {field.label} ({field.unit})
                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                </label>
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={form[field.name]}
                                                    onChange={handleChange}
                                                    required={field.required}
                                                    placeholder={field.placeholder}
                                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all transform ${
                                loading 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Add Measurement'
                            )}
                        </button>
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default AddMeasurementForm;