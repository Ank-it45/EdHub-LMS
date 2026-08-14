import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle,
  Zap,
  Award,
  Star
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
import Loader from '../components/Loader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const [instructorMessage, setInstructorMessage] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/courses');
        if (res.data.success) {
          setCourses(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch courses for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="position-relative py-5 overflow-hidden">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center min-vh-75 py-5 g-5">
            <div className="col-lg-7 text-start">
              <div className="d-inline-flex align-items-center gap-2 glass-badge glass-badge-primary mb-3">
                <Sparkles size={14} /> Next-Generation Learning Experience
              </div>
              <h1 className="display-4 fw-extrabold text-white mb-3 brand-font lh-sm">
                Master In-Demand Skills with <span className="text-gradient">EdHub</span>
              </h1>
              <p className="lead text-secondary mb-4 pe-lg-4" style={{ fontSize: '1.2rem', lineHeight: '1.7' }}>
                Discover modern full-stack development, cloud architecture, database engineering, and glassmorphic UI design through interactive, project-driven curriculums taught by industry professionals.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/courses" className="glass-btn glass-btn-primary py-3 px-4 fs-6">
                  <BookOpen size={19} />
                  <span>Browse All Courses</span>
                  <ArrowRight size={17} />
                </Link>
                <Link
                  to={isAuthenticated ? '/courses' : '/login'}
                  state={!isAuthenticated ? { from: '/courses' } : undefined}
                  className="glass-btn py-3 px-4 fs-6 text-white"
                >
                  <span>Start Learning Free</span>
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="d-flex align-items-center gap-4 mt-5 pt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" className="rounded-circle border border-dark" style={{ width: '38px', height: '38px', objectFit: 'cover' }} alt="User" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" className="rounded-circle border border-dark ms-n2" style={{ width: '38px', height: '38px', objectFit: 'cover', marginLeft: '-12px' }} alt="User" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" className="rounded-circle border border-dark ms-n2" style={{ width: '38px', height: '38px', objectFit: 'cover', marginLeft: '-12px' }} alt="User" />
                </div>
                <div>
                  <div className="d-flex align-items-center text-warning gap-1 small">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-white fw-bold ms-1">4.9/5</span>
                  </div>
                  <div className="text-muted small">From 2,500+ student reviews</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-lg-5">
              <div className="position-relative">
                <GlassCard className="p-4 shadow-lg border-opacity-50">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2.5 rounded-3 bg-primary bg-opacity-20 text-primary">
                        <Zap size={24} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-white mb-0">Platform Highlights</h6>
                        <small className="text-muted">Real-Time Course Engine</small>
                      </div>
                    </div>
                    <span className="glass-badge glass-badge-success small">Live</span>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <ShieldCheck size={20} className="text-info" />
                        <span className="small text-white">Server-Verified RBAC</span>
                      </div>
                      <span className="badge bg-dark text-info">Protected</span>
                    </div>

                    <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <CheckCircle size={20} className="text-success" />
                        <span className="small text-white">Simulated Payment Checkout</span>
                      </div>
                      <span className="badge bg-success bg-opacity-25 text-success">Instant Txn</span>
                    </div>

                    <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <Award size={20} className="text-warning" />
                        <span className="small text-white">Cloudinary Media Integration</span>
                      </div>
                      <span className="badge bg-warning bg-opacity-25 text-warning">Cloud-Ready</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
                    <Link to="/courses" className="text-primary text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1">
                      Explore Full Course Catalog <ArrowRight size={14} />
                    </Link>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5 my-3">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4 pb-2 text-start">
            <div>
              <div className="glass-badge glass-badge-primary mb-2">Featured Curriculums</div>
              <h2 className="fw-bold text-white brand-font m-0">Top-Rated Engineering Courses</h2>
            </div>
            <Link to="/courses" className="glass-btn mt-3 mt-md-0 align-self-start align-self-md-end text-secondary">
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading featured courses..." />
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <div key={course.id} className="col-md-6 col-lg-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white brand-font mb-2">Engineered for Maximum Learning Impact</h2>
            <p className="text-muted" style={{ maxWidth: '560px', margin: '0 auto' }}>
              Everything you need to level up your engineering career from fundamentals to production mastery.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <GlassCard hover className="h-100 text-start">
                <div className="feature-icon-tile p-3 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <Users size={28} strokeWidth={2.2} />
                </div>
                <h5 className="fw-bold text-white mb-2">Role-Based Experience</h5>
                <p className="text-secondary small mb-0">
                  Customized dashboards and workflows for Students, Instructors, and Administrators with strict server-side RBAC protection.
                </p>
              </GlassCard>
            </div>

            <div className="col-md-4">
              <GlassCard hover className="h-100 text-start">
                <div className="feature-icon-tile p-3 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <ShieldCheck size={28} strokeWidth={2.2} />
                </div>
                <h5 className="fw-bold text-white mb-2">Simulated Order Pipeline</h5>
                <p className="text-secondary small mb-0">
                  Test frictionless checkouts with our secure mock transaction engine without needing real credit card details.
                </p>
              </GlassCard>
            </div>

            <div className="col-md-4">
              <GlassCard hover className="h-100 text-start">
                <div className="feature-icon-tile p-3 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <Sparkles size={28} strokeWidth={2.2} />
                </div>
                <h5 className="fw-bold text-white mb-2">Glassmorphism Aesthetics</h5>
                <p className="text-secondary small mb-0">
                  Immerse yourself in a translucent glass design system engineered with high-contrast readability and responsiveness.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor CTA Banner */}
      {(isAuthenticated && user?.role === 'STUDENT') && (
        <section className="py-5 mb-5">
          <div className="container">
            <GlassCard className="p-5 text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)' }}>
              <h2 className="fw-bold text-white brand-font mb-3">Teach the Next Generation of Developers</h2>
              <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                Join our network of expert instructors. Create courses, upload rich media, track student enrollments, and share your technical insights.
              </p>
              {instructorMessage && (
                <div className="glass-panel p-3 mb-3 text-success small fw-semibold">
                  {instructorMessage}
                </div>
              )}
              {user?.instructorRegistered ? (
                <button
                  type="button"
                  className="glass-btn glass-btn-primary py-3 px-4 fs-6 text-white"
                  onClick={() => setInstructorMessage('You are already registered as an instructor with this same account.')}
                >
                  <span>Already Registered as an Instructor</span>
                  <CheckCircle size={18} />
                </button>
              ) : (
                <Link to="/register" state={{ mode: 'INSTRUCTOR_UPGRADE' }} className="glass-btn glass-btn-primary py-3 px-4 fs-6 text-white">
                  <span>Register as an Instructor</span>
                  <ArrowRight size={18} />
                </Link>
              )}
            </GlassCard>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
