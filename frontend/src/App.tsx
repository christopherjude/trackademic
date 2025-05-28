import "@/styles/App.css";
import MainLayout from "@/layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/student/Dashboard";

function App() {
    return (
        <Routes>
            {/* Pages with MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
            </Route>

            {/* Pages without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
    );
}

export default App;
