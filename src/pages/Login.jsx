import axios from "axios";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [form, setForm] = useState({ name: "", password: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop",
      title: "Start Your Journey",
      text: "Transform your fitness goals into reality",
    },
    {
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop",
      title: "Stay Motivated",
      text: "Push your limits and see the results",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1000&fit=crop",
      title: "Achieve Success",
      text: "Consistency is the key to a healthier you",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const setAuth = useAuthStore.getState().setAuth;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        form
      );

      const data = res.data;

      setMessage({
        type: "success",
        text: `Welcome back, ${data.user?.name || form.name}!`,
      });

      setForm({ name: "", password: "" });

      if (data.token) {
        setAuth(data.token, data.user);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.msg || err.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4 py-8">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side - Auto Slider */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 to-blue-600/60 z-10"></div>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                slideIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12">
                <h3 className="text-4xl font-bold mb-4">{slide.title}</h3>
                <p className="text-lg text-white/90 text-center">
                  {slide.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Form */}
        <div
          className={`w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center transition-all duration-1000 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          {/* Logo */}
          <div className="flex justify-center lg:justify-start mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500">
              Sign in to continue your fitness journey
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-center font-medium transition-all duration-500 transform ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-5">
            {/* Username */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  focusedField === "name"
                    ? "border-blue-400 shadow-lg shadow-blue-200 scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                  focusedField === "password"
                    ? "border-blue-400 shadow-lg shadow-blue-200 scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                required
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="relative w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => (window.location.href = "/register")}
                className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
