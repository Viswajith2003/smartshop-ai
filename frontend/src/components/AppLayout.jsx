import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = React.memo(({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const menuItems = useMemo(
    () => [
      {
        path: "/",
        icon: "bi-house-door",
        label: "Home",
      },
      {
        path: "/profile",
        icon: "bi-person",
        label: "Profile",
      },
      {
        path: "/dashboard",
        icon: "bi-kanban",
        label: "Dashboard",
      },
    ],
    []
  );

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div
              className="bg-white rounded text-primary d-flex align-items-center justify-content-center me-2 me-sm-3"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="bi bi-layers fs-5"></i>
            </div>
            <div className="d-none d-sm-block">
              <div className="fw-bold">TaskFlow</div>
              <small
                className="opacity-75 d-block"
                style={{ fontSize: "0.75rem", lineHeight: "1" }}
              >
                Project Manager
              </small>
            </div>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <i
              className={`bi ${
                mobileMenuOpen ? "bi-x" : "bi-list"
              } text-primary fs-4`}
            ></i>
          </button>

          <div
            className={`collapse navbar-collapse ${
              mobileMenuOpen ? "show" : ""
            }`}
            id="navbarNav"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <Link
                    className={`nav-link px-3 py-2 rounded mx-1 ${
                      location.pathname === item.path
                        ? "bg-white text-primary fw-medium"
                        : "text-dark"
                    }`}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="d-none d-lg-flex align-items-center gap-3">
              <div className="dropdown">
                <button
                  className="btn btn-outline-light d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-bell"></i>
                  <span className="ms-2">Notifications</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 className="dropdown-header">Recent Notifications</h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <span className="dropdown-item-text text-muted">
                      No new notifications
                    </span>
                  </li>
                </ul>
              </div>

              <div className="dropdown">
                <button
                  className="btn btn-outline-light d-flex align-items-center text-white"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                  }}
                >
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <span className="text-primary fw-bold small">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-white d-none d-md-inline">
                    {user?.name || "User"}
                  </span>
                  <i className="bi bi-chevron-down ms-2 text-white"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="dropdown-item-text">
                      <div className="fw-medium">{user?.name || "User"}</div>
                      <small className="text-muted">
                        {user?.email || "user@example.com"}
                      </small>
                    </div>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear me-2"></i>Settings
                    </Link>
                  </li>
                  {user?.role === "admin" && (
                    <>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-warning"
                          to="/admin"
                        >
                          <i className="bi bi-shield-lock me-2"></i>Admin Panel
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="d-lg-none text-dark">

              <div className="mb-3">
                <ul className="list-unstyled ps-4 mb-0">
                  {user?.role === "admin" && (
                    <li>
                      <Link
                        className="nav-link text-warning py-1 px-0"
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="bi bi-shield-lock me-2"></i>Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      className="nav-link text-danger py-1 px-0 border-0 bg-transparent w-100 text-start"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">{children}</main>
    </div>
  );
});

export default AppLayout;
