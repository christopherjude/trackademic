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

  return (
    <section className="relative bg-background-light min-h-screen py-16 px-8 overflow-hidden flex items-center justify-center">
      {/* Back to Home button */}
      <Link 
        to="/" 
        className="fixed top-8 left-4 flex items-center gap-2 text-secondary hover:text-primary transition-all z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 opacity-30">
        <div className="bg-surface-light w-[200px] h-[150px] rounded-lg blur-sm"></div>
      </div>

      <div className="max-w-md w-full z-10 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome Back</h1>
          <p className="text-secondary text-lg">
            Sign in to your Trackademic account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <p className="text-gray-600 text-sm mb-3">
              Demo accounts for testing:
            </p>
            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-md">
              <p><strong>Student:</strong> student@test.com / password123</p>
              <p><strong>Supervisor:</strong> supervisor@test.com / password123</p>
              <p><strong>Director:</strong> director@test.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
