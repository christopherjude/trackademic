import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setError("");
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    const success = await login(demoEmail, demoPassword);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Demo login failed");
    }
  };

  return (
    <section className="relative bg-background-light min-h-screen py-16 px-8 overflow-hidden flex items-center justify-center">
      {/* Back to Home button */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 flex items-center gap-2 text-secondary hover:text-primary transition-all z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Background decorative elements matching Hero design */}
      <div className="absolute top-20 right-20 opacity-30">
        <div className="bg-surface-light w-[200px] h-[150px] rounded-lg blur-sm"></div>
      </div>
      <div className="absolute bottom-32 left-20 opacity-20">
        <div className="bg-surface-dark w-[150px] h-[100px] rounded-lg blur-sm"></div>
      </div>

      <div className="max-w-md w-full z-10 relative">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-primary mb-2">Trackademic</div>
          <span className="text-secondary text-sm bg-accent py-1 px-3 rounded-full">
            Academic Success Platform
          </span>
          <h1 className="text-4xl font-bold text-primary mt-6 mb-4">Welcome Back</h1>
          <p className="text-secondary text-lg">
            Sign in to continue your academic journey
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-black px-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-black px-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-background-light py-3 px-6 rounded-lg shadow-lg hover:bg-secondary transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-secondary text-sm mb-3">
              Demo accounts for testing (click to login):
            </p>
            <div className="text-xs space-y-2 bg-surface-light p-4 rounded-lg">
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-surface-dark hover:text-white p-2 rounded transition-all"
                onClick={() => handleDemoLogin("student@test.com", "password123")}
              >
                <span className="font-medium text-primary">Student:</span>
                <span className="text-secondary">student@test.com / password123</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-surface-dark hover:text-white p-2 rounded transition-all"
                onClick={() => handleDemoLogin("supervisor@test.com", "password123")}
              >
                <span className="font-medium text-primary">Supervisor:</span>
                <span className="text-secondary">supervisor@test.com / password123</span>
              </div>
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-surface-dark hover:text-white p-2 rounded transition-all"
                onClick={() => handleDemoLogin("director@test.com", "password123")}
              >
                <span className="font-medium text-primary">Director:</span>
                <span className="text-secondary">director@test.com / password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
