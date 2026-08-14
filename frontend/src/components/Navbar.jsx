import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  PlusCircle,
  LogOut,
  User,
  Layers
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg glass-navbar sticky-top py-3">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 p-2"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <span className="fs-4 fw-bold brand-font text-white">Ed<span className="text-gradient">Hub</span></span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-white"></i>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-2 px-3 rounded-3 ${isActive ? 'text-white fw-semibold bg-white bg-opacity-10' : 'text-secondary'}`
                }
              >
                <BookOpen size={17} />
                <span>Explore Courses</span>
              </NavLink>
            </li>

            {isAuthenticated && user?.role === 'STUDENT' && (
              <li className="nav-item">
                <NavLink
                  to="/student-dashboard"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 px-3 rounded-3 ${isActive ? 'text-white fw-semibold bg-white bg-opacity-10' : 'text-secondary'}`
                  }
                >
                  <LayoutDashboard size={17} />
                  <span>My Learning</span>
                </NavLink>
              </li>
            )}

            {isAuthenticated && (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' || user?.instructorRegistered) && (
              <li className="nav-item">
                <NavLink
                  to="/instructor-dashboard"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 px-3 rounded-3 ${isActive ? 'text-white fw-semibold bg-white bg-opacity-10' : 'text-secondary'}`
                  }
                >
                  <Layers size={17} />
                  <span>Instructor Studio</span>
                </NavLink>
              </li>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <li className="nav-item">
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 px-3 rounded-3 ${isActive ? 'text-white fw-semibold bg-white bg-opacity-10' : 'text-secondary'}`
                  }
                >
                  <ShieldCheck size={17} />
                  <span>Admin Panel</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action / Auth Buttons */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' || user?.instructorRegistered) && (
                  <Link to="/courses/create" className="glass-btn glass-btn-primary py-2 px-3 d-none d-md-flex text-white">
                    <PlusCircle size={17} />
                    <span>Create Course</span>
                  </Link>
                )}

                <div className="dropdown">
                  <button
                    className="glass-btn py-1 px-2 d-flex align-items-center gap-2 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2563eb&color=fff`}
                      alt={user?.name}
                      className="rounded-circle"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <div className="text-start d-none d-sm-block pe-1">
                      <div className="fw-semibold text-white lh-1 small">{user?.name}</div>
                      <span className="badge bg-primary bg-opacity-25 text-info mt-1" style={{ fontSize: '0.65rem' }}>
                        {user?.role}
                      </span>
                    </div>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end glass-card p-2 mt-2 shadow-lg border-0" style={{ minWidth: '220px', background: 'rgba(15, 23, 42, 0.95)' }}>
                    <li className="px-3 py-2 border-bottom border-secondary border-opacity-25">
                      <div className="fw-bold text-white">{user?.name}</div>
                      <div className="small text-muted text-truncate">{user?.email}</div>
                    </li>
                    <li>
                      <Link to="/profile" className="dropdown-item text-secondary py-2 rounded-2 mt-1 d-flex align-items-center gap-2">
                        <User size={16} />
                        <span>Profile Settings</span>
                      </Link>
                    </li>
                    {user?.role === 'STUDENT' && (
                      <li>
                        <Link to="/student-dashboard" className="dropdown-item text-secondary py-2 rounded-2 d-flex align-items-center gap-2">
                          <LayoutDashboard size={16} />
                          <span>Student Dashboard</span>
                        </Link>
                      </li>
                    )}
                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' || user?.instructorRegistered) && (
                      <li>
                        <Link to="/instructor-dashboard" className="dropdown-item text-secondary py-2 rounded-2 d-flex align-items-center gap-2">
                          <Layers size={16} />
                          <span>Manage Courses</span>
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider border-secondary border-opacity-25 my-1" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger py-2 rounded-2 d-flex align-items-center gap-2">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="glass-btn py-2 px-3 text-secondary">
                  Log In
                </Link>
                <Link to="/register" className="glass-btn glass-btn-primary py-2 px-3 text-white">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
