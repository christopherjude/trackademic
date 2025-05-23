import '@/styles/App.css'
import MainLayout from '@/layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
     {/* Pages with MainLayout */}
     <Route element={<MainLayout />}>
       <Route path="/" element={<Home />} />
    </Route>

    {/* Pages without layout */}
    <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
