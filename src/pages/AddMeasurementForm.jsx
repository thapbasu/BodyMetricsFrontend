import React, { useState } from 'react';
import Layout from '../components/Layout.jsx';
import useAuthStore from '../store/authStore';

const AddMeasurementForm = ({ onAddSuccess }) => {
    const userId = useAuthStore((state) => state.user?.id);
    const [selectedDate, setSelectedDate] = useState('');
    const [form, setForm] = useState({
        weight: '',
        height: '',
        chest: '',
        waist: '',
        arm: '',
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
            console.log('userId',userId);
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
                arm: form.arm ? Number(form.arm) : undefined,
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
                    arm: '',
                    thighs: '',
                    calves: '',
                    shoulders: '',
                    forearms: '',
                    neck: '',
                    hips: '',
                });
                setSelectedDate('');

                if (onAddSuccess) onAddSuccess(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

    return (
        <Layout title="Add New Measurement">
            <main className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-12 font-poppins">
                <h1 className="text-3xl font-bold text-rose mb-6 text-center">Add New Measurement</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">{error}</div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="date" className="block mb-2 font-semibold text-gray-700">
                            Measurement Date <span className="text-rose">*</span>
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={selectedDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose"
                        />
                    </div>

                    <div>
                        <label htmlFor="weight" className="block mb-2 font-semibold text-gray-700">
                            Weight (kg) <span className="text-rose">*</span>
                        </label>
                        <input
                            id="weight"
                            name="weight"
                            type="number"
                            min="0"
                            step="0.1"
                            value={form.weight}
                            onChange={handleChange}
                            required
                            placeholder="Enter your weight"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose"
                        />
                    </div>

                    <div>
                        <label htmlFor="height" className="block mb-2 font-semibold text-gray-700">
                            Height (cm)
                        </label>
                        <input
                            id="height"
                            name="height"
                            type="number"
                            min="0"
                            step="0.1"
                            value={form.height}
                            onChange={handleChange}
                            placeholder="Optional"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose"
                        />
                    </div>

                    {/* Two-column grid for other measurements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['chest', 'waist', 'arm', 'thighs', 'calves', 'shoulders', 'forearms', 'neck', 'hips'].map((key) => (
                            <div key={key}>
                                <label htmlFor={key} className="block mb-1 text-gray-700 capitalize">
                                    {key}
                                </label>
                                <input
                                    id={key}
                                    name={key}
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={form[key]}
                                    onChange={handleChange}
                                    placeholder="cm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-md text-white font-bold text-lg transition ${
                            loading ? 'bg-rose/70 cursor-not-allowed' : 'bg-rose hover:bg-rose/90'
                        }`}
                    >
                        {loading ? 'Saving...' : 'Add Measurement'}
                    </button>
                </form>
            </main>
        </Layout>
    );
};

export default AddMeasurementForm;
