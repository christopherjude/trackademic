import "@/styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/student/Dashboard";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./layouts/ProtectedLayout";

function App() {
    return (
        <Routes>
            {/* Pages with MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
            </Route>

            {/* Pages without layout */}
            <Route path="/login" element={<Login />} />

            { /* Protected routes with dashboard layout */}
            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
