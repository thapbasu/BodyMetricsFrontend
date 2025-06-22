import { useState } from "react";
import {
    Home,
    Settings,
    User,
    Menu,
    LogOut,
    X,
    BarChart3
} from "lucide-react";
import {NavLink, useNavigate} from "react-router-dom";
import useAuthStore from "../store/authStore.js";


const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Add new Measurement", icon: User, path: "/add-measurement-form" },
    { name: "Progress Analytics", icon: BarChart3, path: "/progress-analytics" },
];


export default function Layout({ children,title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const handleLogout = () => {
        clearAuth();        // Clear Zustand auth state
        navigate("/");      // Redirect to home
    };
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar (Responsive) */}
            <div
                className={`
          fixed top-0 left-0 h-full bg-white border-r z-20 transition-all duration-300
          ${sidebarOpen ? "w-60" : "w-16"}
          md:static md:flex md:flex-col
        `}
                onMouseEnter={() => setSidebarOpen(true)}
                onMouseLeave={() => setSidebarOpen(false)}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="text-lg font-semibold">
            {sidebarOpen ? "BodyMetrics" : "BM"}
          </span>
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
                        className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 text-sm">
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-16 md:ml-0 transition-all duration-300">
                {/* Header */}
                <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">{title}</h1>
                </header>

                {/* Page Content */}
                <main className="p-6 overflow-auto flex-1">{children}</main>
            </div>
        </div>
    );
}