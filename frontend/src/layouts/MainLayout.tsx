import React from 'react';
import Navbar from "@/components/Navbar"
import Footer from '@/components/Footer';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow px-5'>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
