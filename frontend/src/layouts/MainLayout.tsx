import Navbar from "@/components/Navbar"
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow px-5'><Outlet/></main>
      <Footer />
    </div>
  );
};

export default MainLayout;
