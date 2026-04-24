import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/common/Loader'

const ProtectedRoute = React.memo(({ children, redirectTo = "/login", role }) => {
  const { isAuthenticated, isAdminAuthenticated, loading, user } = useSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen text="Authenticating..." />
  }

  // Check if either standard user or admin is authenticated
  if (!isAuthenticated && !isAdminAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If a specific role is required (like 'admin'), check the user's role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
})

export default ProtectedRoute;
