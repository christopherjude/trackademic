import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import LoginInfoPanel from '@/components/auth/LoginInfoPanel';

const Login = () => {
  return (
    <div className="flex h-screen bg-background-light">
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="hidden lg:block w-1/2">
        <LoginInfoPanel />
      </div>
    </div>
  );
};

export default Login;

