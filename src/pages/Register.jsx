import { useState, useEffect } from "react";
import axios from "axios";

export default function Register() {
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
      title: "Join the Movement",
      text: "Create your account and start strong",
    },
    {
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop",
      title: "Build Consistency",
      text: "Small steps every day lead to big results",
    },
    {
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1000&fit=crop",
      title: "Become Your Best",
      text: "Your fitness journey starts here",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        form
      );

      setMessage({
        type: "success",
        text: res.data.msg || "Registration successful!",
      });
      setForm({ name: "", password: "" });

      window.location.href = "/";
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.msg || err.message || "Failed to register",
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
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12 text-center">
                <h3 className="text-4xl font-bold mb-4">{slide.title}</h3>
                <p className="text-lg text-white/90">{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Register Form */}
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
              Create Account
            </h2>
            <p className="text-gray-500">
              Join us and start your fitness journey
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-center font-medium transition-all duration-500 ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Choose a username"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                  focusedField === "name"
                    ? "border-blue-400 shadow-lg shadow-blue-200 scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Create a secure password"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 ${
                  focusedField === "password"
                    ? "border-blue-400 shadow-lg shadow-blue-200 scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => (window.location.href = "/")}
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
