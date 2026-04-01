import '../styles/animations.css'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = React.memo(() => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="text-center"
      >
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        </div>
        <h1 className="display-4 mb-3">404</h1>
        <h2 className="h4 mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go Home
          </Link>
          <Link to="/app/dashboard" className="btn btn-outline-primary">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
})

export default NotFound