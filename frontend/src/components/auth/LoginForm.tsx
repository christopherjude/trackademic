import { useMsal } from "@azure/msal-react";
import React, {useState} from "react";

const LoginForm = () => {
    const { instance } = useMsal();
    const [error,setError] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        try{
            console.log("Calling redirect to log in...");
            instance.loginRedirect();
        } catch (error) {
            console.error("Login failed:", error);
            setError("Email or password is incorrect.");
        }
    }

    return (
        <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Welcome Back</h2>
            <p className="text-sm text-secondary mb-6">
                Enter your email and password to access your account.
            </p>
            {error && (
                <p className="text-red-500 text-sm mb-4">
                    {error}
                </p>
            )}
            <div className="space-y-4">
            {/* <form onSubmit={handleLogin} className="space-y-4"> */}
                <div>
                    <label className="text-sm text-secondary">Email</label>
                    <input
                        type="email"
                        className="w-full p-3 border border-neutral-light text-primary placeholder-text-muted rounded-md mt-1"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="text-sm text-secondary">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 border border-neutral-light text-primary placeholder-text-muted rounded-md mt-1"
                        placeholder="••••••••"
                    />
                </div>
                <div className="flex justify-between items-center text-sm text-secondary">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        Remember Me
                    </label>
                    <a href="#" className="text-primary hover:underline">
                        Forgot your password?
                    </a>
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-md hover:bg-secondary transition" onClick={handleLogin}>
                    Log In
                </button>
            {/* </form> */}
            </div>

            <p className="text-center text-sm mt-6 text-secondary">
                Don’t have an account?{" "}
                <a href="#" className="text-primary font-medium hover:underline">
                    Register Now
                </a>
            </p>
        </div>
    );
};

export default LoginForm;
