import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';


export default function Login() {
    const [form, setForm] = useState({ name: '', password: '' });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const setAuth = useAuthStore.getState().setAuth;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.msg || 'Failed to login');
            // Use token and user as per your response
            setAuth(data.token, data.user);
            console.log('Auth set:', useAuthStore.getState()); // ✅ Check if token & user are updated

            // Optionally keep token in localStorage for persistence
            localStorage.setItem('token', data.token);

            setMessage({ type: 'success', text: `Welcome back, ${data.user.name}!` });
            setForm({ name: '', password: '' });
            navigate('/dashboard');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-blush font-poppins px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center text-lilac mb-8">Welcome Back 💖</h2>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded text-center ${
                            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="basu or chibi"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lilac"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Your secret code"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lilac"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-lilac hover:bg-rose transition text-white py-3 rounded-lg font-semibold text-lg disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="/register" className="text-lilac hover:underline">Register here</a>
                </p>
            </div>
        </div>
    );
}
