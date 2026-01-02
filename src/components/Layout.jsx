import { useState, useRef, useEffect } from "react";
import {
  Home,
  User,
  BarChart3,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Add new Measurement", icon: User, path: "/add-measurement-form" },
  { name: "Progress Analytics", icon: BarChart3, path: "/progress-analytics" },
];

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const userName = useAuthStore((state) => state.user.name);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r z-20 transition-all duration-300
          ${sidebarOpen ? "w-60" : "w-16"}
          md:static md:flex md:flex-col
        `}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex items-center justify-center px-4 py-4 border-b">
          {sidebarOpen ? (
<a href="/dashboard">            <img src="/logo.png" className="w-18 h-18 object-cover cursor-pointer" />

</a>          ) : (
            <span className="text-lg font-semibold">BM</span>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) =>
                `flex items-center gap-4 p-2 rounded transition ${
                  isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 text-sm"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ml-16 md:ml-0 transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white relative shadow px-6 py-4 flex justify-end items-center">
          <div ref={dropdownRef} className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setShowProfileDropdown((prev) => !prev)}
            >
              <h1 className="font-medium">{userName}</h1>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                <ul className="flex flex-col p-2">
                  <li className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                    View Profile
                  </li>
                  <li
                    onClick={handleLogout}
                    className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
