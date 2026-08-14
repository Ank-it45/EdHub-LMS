import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CourseCreateEditPage from './pages/CourseCreateEditPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes (All Authenticated Users) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Instructor & Admin Protected Routes */}
          <Route
            path="/instructor-dashboard"
            element={
              <RoleGuard allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <InstructorDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/courses/create"
            element={
              <RoleGuard allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CourseCreateEditPage />
              </RoleGuard>
            }
          />
          <Route
            path="/courses/:id/edit"
            element={
              <RoleGuard allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                <CourseCreateEditPage />
              </RoleGuard>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </RoleGuard>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="glass-navbar py-4 mt-5 border-top border-secondary border-opacity-25 text-start">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold brand-font text-white">Ed<span className="text-gradient">Hub</span></span>
            <span className="text-muted small">© 2026. All rights reserved. Glassmorphism Edition.</span>
          </div>
          <div className="d-flex align-items-center gap-3 small text-muted">
            <span className="glass-badge small py-0.5">Simulated Payment Sandbox</span>
            <span className="glass-badge glass-badge-primary small py-0.5">PostgreSQL + Prisma</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
