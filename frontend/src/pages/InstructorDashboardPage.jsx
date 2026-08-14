import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Layers,
  Users,
  DollarSign,
  Edit3,
  Trash2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses', {
        params: { instructorId: user.id },
      });
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load instructor courses:', err);
      setError('Failed to fetch your courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchInstructorCourses();
    }
  }, [user]);

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error('Failed to delete course:', err);
      setError(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalEnrollments = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.price * (c._count?.enrollments || 0)), 0);

  return (
    <div className="container py-5 text-start">
      {/* Banner */}
      <div className="glass-card p-4 p-md-5 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <div className="glass-badge glass-badge-primary mb-2">Instructor Studio</div>
          <h1 className="fw-bold text-white brand-font mb-1">Course Management Portal</h1>
          <p className="text-secondary mb-0">
            Publish courses, manage curriculums, and review student engagement metrics.
          </p>
        </div>
        <Link to="/courses/create" className="glass-btn glass-btn-primary py-2.5 px-4 text-white align-self-start align-self-md-auto">
          <PlusCircle size={18} />
          <span>Create New Course</span>
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <GlassCard className="p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <BookOpen size={24} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <div className="text-muted small">Total Courses</div>
                <div className="fs-3 fw-bold text-white">{courses.length}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-md-4">
          <GlassCard className="p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <Users size={24} style={{ color: '#22d3ee' }} />
              </div>
              <div>
                <div className="text-muted small">Active Enrollments</div>
                <div className="fs-3 fw-bold text-white">{totalEnrollments}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-md-4">
          <GlassCard className="p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <DollarSign size={24} style={{ color: '#34d399' }} />
              </div>
              <div>
                <div className="text-muted small">Simulated Gross Value</div>
                <div className="fs-3 fw-bold text-white">₹{totalRevenue.toFixed(2)}</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Course Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-white brand-font mb-0">Your Published Courses</h4>
          <span className="badge bg-secondary text-light">{courses.length} Courses</span>
        </div>

        {loading ? (
          <Loader message="Loading instructor courses..." />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No courses created yet"
            description="Get started by creating your first course and uploading its curriculum media."
            actionText="Create Course"
            onAction={() => window.location.assign('/courses/create')}
          />
        ) : (
          <div className="table-responsive">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                          alt={c.title}
                          className="rounded-2"
                          style={{ width: '50px', height: '36px', objectFit: 'cover' }}
                        />
                        <div className="fw-semibold text-white text-truncate" style={{ maxWidth: '280px' }}>
                          {c.title}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="glass-badge glass-badge-primary small">{c.category}</span>
                    </td>
                    <td>
                      <span className="glass-badge small">{c.level}</span>
                    </td>
                    <td className="fw-bold text-white">₹{Number(c.price).toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-1 small text-info">
                        <Users size={14} />
                        <span>{c._count?.enrollments || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Link
                          to={`/courses/${c.id}`}
                          className="btn btn-sm btn-outline-light p-1.5"
                          title="View Course Page"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <Link
                          to={`/courses/${c.id}/edit`}
                          className="btn btn-sm btn-outline-info p-1.5"
                          title="Edit Course"
                        >
                          <Edit3 size={15} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1.5"
                          title="Delete Course"
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          disabled={deleteLoading}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboardPage;
