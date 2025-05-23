import React from 'react';

const LoginInfoPanel = () => {
  return (
    <div className="flex-1 bg-primary text-white p-12 flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-2">Effortlessly manage your academic progress</h2>
      <p className="text-sm mb-8">Log in to access your Trackademic dashboard and stay on top of milestones.</p>
      <img src="/dashboard-preview.png" alt="Dashboard preview" className="rounded-lg shadow-lg" />
    </div>
  );
};

export default LoginInfoPanel;

