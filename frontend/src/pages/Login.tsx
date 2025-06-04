import LoginForm from "@/components/auth/LoginForm";
import LoginInfoPanel from "@/components/auth/LoginInfoPanel";

const Login = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Left - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background-light px-8">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>

            {/* Right - Info Panel */}
            <div className="hidden lg:flex w-1/2 bg-primary text-white items-center justify-center">
                <LoginInfoPanel />
            </div>
        </div>
    );
};

export default Login;
