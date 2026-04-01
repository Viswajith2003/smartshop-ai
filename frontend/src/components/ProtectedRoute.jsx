import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loading } from './ui'

export const ProtectedRoute = React.memo(({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading fullScreen text="Authenticating..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return children
})

export const PublicRoute = React.memo(({ children, redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading fullScreen text="Loading..." />
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
})

export const AdminRoute = React.memo(({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading fullScreen text="Verifying admin access..." />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
})
