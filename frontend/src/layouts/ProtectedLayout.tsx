import { useMsal } from "@azure/msal-react"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { inProgress, accounts } = useMsal()
  const location = useLocation()

  if (inProgress !== "none") {
    return <div>Loading authentication…</div>
  }

  if (accounts.length === 0) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute