import { useAuth } from "../context/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isInitializing } = useAuth()
  const location = useLocation()

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-2">Trackademic</div>
          <div className="text-secondary">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute