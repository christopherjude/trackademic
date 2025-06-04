import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "@/styles/App.css";
import MainLayout from "@/layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/student/Dashboard";
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { element: _jsx(MainLayout, {}), children: _jsx(Route, { path: "/", element: _jsx(Home, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/student/dashboard", element: _jsx(StudentDashboard, {}) })] }));
}
export default App;
