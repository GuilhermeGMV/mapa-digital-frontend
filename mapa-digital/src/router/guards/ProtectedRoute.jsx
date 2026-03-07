import { Navigate } from 'react-router-dom'
import { PATHS } from '../paths'

export default function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />
  }

  return children
}
