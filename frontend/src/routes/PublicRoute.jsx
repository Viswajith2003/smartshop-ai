import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/common/Loader'

const PublicRoute = React.memo(({ children, redirectTo = "/" }) => {
  const { isAuthenticated, isAdminAuthenticated, loading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen text="Loading..." />
  }

  if (isAuthenticated || isAdminAuthenticated) {
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />
  }

  return children
})

export default PublicRoute;
