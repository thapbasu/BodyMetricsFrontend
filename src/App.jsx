import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard.jsx";
import AddMeasurementForm from "./pages/AddMeasurementForm.jsx";
import ProgressAnalytics from "./pages/ProgressAnalytics.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-measurement-form" element={<AddMeasurementForm />} />
                <Route path="/progress-analytics" element={<ProgressAnalytics />} />

            </Routes>
        </Router>
    );
}
