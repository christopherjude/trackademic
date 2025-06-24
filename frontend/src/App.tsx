import "@/styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
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
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;
