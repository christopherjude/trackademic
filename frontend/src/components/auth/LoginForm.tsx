import { useMsal } from "@azure/msal-react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const LoginForm = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (accounts.length > 0) {
      navigate("/dashboard");
    }
  }, [accounts, navigate]);

  const handleLogin = async () => {
    try {
      await instance.loginRedirect({
        scopes: ["User.Read"],
        redirectUri: window.location.origin + "/dashboard",
      });
    } catch (error) {
      console.error("Login failed:", error);
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

      {/* Background decorative elements matching Hero */}
      <div className="absolute top-20 right-20 opacity-30">
        <div className="bg-surface-light w-[200px] h-[150px] rounded-lg blur-sm"></div>
      </div>
      {/* <div className="absolute bottom-32 left-20 opacity-20">
        <div className="bg-surface-dark w-[150px] h-[100px] rounded-lg blur-sm"></div>
      </div> */}

      <div className="max-w-md w-full z-10 relative">
        {/* <div className="bg-surface-light rounded-lg shadow-lg p-8 space-y-6"> */}
          <div className="text-center">
            
            <h1 className="text-4xl font-bold text-primary mt-6 mb-4">Welcome to Trackademic</h1>
            <p className="text-secondary text-lg">
              Sign in to your academic account and start tracking your journey
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogin}
              className="w-full bg-primary text-background-light py-3 px-6 rounded-lg shadow-lg hover:bg-secondary transition-all font-semibold flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              Sign in with Microsoft
            </button>
          </div>

          <div className="text-center text-sm text-muted mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default LoginForm;
