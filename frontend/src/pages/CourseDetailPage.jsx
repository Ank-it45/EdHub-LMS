import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Users,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  BookOpen,
  Layers,
  Lock
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import DemoPaymentModal from '../components/DemoPaymentModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        }

        // Check if current user is enrolled
        if (isAuthenticated) {
          const enrollRes = await api.get('/enrollments/me');
          if (enrollRes.data.success) {
            const hasEnrolled = enrollRes.data.data.some((e) => e.courseId === id);
            setIsEnrolled(hasEnrolled);
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
        setError(err.response?.data?.message || 'Course not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, isAuthenticated]);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    if ((user?.role === 'INSTRUCTOR' || user?.instructorRegistered) && user?.id === course?.instructorId) return;
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
  };

  if (loading) {
    return <Loader message="Loading course curriculum & details..." />;
  }

  if (error || !course) {
    return (
      <div className="container py-5 text-center">
        <ErrorMessage message={error || 'Course not found.'} />
        <Link to="/courses" className="glass-btn glass-btn-primary mt-3">
          <ArrowLeft size={16} /> Back to Courses
        </Link>
      </div>
    );
  }

  const isInstructorOwner = (user?.role === 'INSTRUCTOR' || user?.instructorRegistered) && user?.id === course.instructorId;
  const isOwner = user?.id === course.instructorId || user?.role === 'ADMIN';

  return (
    <div className="container py-5">
      {/* Back Link */}
      <div className="text-start mb-4">
        <Link to="/courses" className="text-secondary text-decoration-none small d-inline-flex align-items-center gap-2 hover-light">
          <ArrowLeft size={16} /> Back to all courses
        </Link>
      </div>

      <div className="row g-4 text-start">
        {/* Left Column: Course Main Info & Curriculum */}
        <div className="col-lg-8">
          <div className="glass-card p-4 p-md-5 mb-4">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="glass-badge glass-badge-primary">
                {course.category || 'General'}
              </span>
              <span className="glass-badge">
                {course.level || 'Beginner'}
              </span>
            </div>

            <h1 className="fw-bold text-white mb-3 brand-font lh-sm">{course.title}</h1>

            <p className="lead text-secondary mb-4" style={{ lineHeight: '1.8' }}>
              {course.description}
            </p>

            {/* Course Meta Info */}
            <div className="d-flex flex-wrap gap-4 pt-3 border-top border-secondary border-opacity-25 text-muted small">
              <div className="d-flex align-items-center gap-2">
                <Users size={16} className="text-info" />
                <span>{course._count?.enrollments || 0} Students Enrolled</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Syllabus / What You'll Learn */}
          <div className="glass-card p-4 p-md-5 mb-4">
            <h3 className="fw-bold text-white mb-4 brand-font d-flex align-items-center gap-2">
              <Sparkles size={22} className="text-warning" /> What You'll Master
            </h3>

            <div className="row g-3">
              {(course.learningOutcomes?.length ? course.learningOutcomes : [
                'Architect scalable full-stack applications with clean separation of concerns.',
                'Implement secure JWT token verification & server-side RBAC authorization.',
                'Model relational databases, unique constraints, and atomic transactions.',
                'Design modern glassmorphic responsive interfaces with Bootstrap 5.',
              ]).map((outcome, index) => (
                <div className="col-md-6" key={`${course.id}-outcome-${index}`}>
                  <div className="glass-panel p-3 d-flex align-items-start gap-2 h-100">
                    <CheckCircle2 size={18} className="text-success mt-1 flex-shrink-0" />
                    <span className="small text-secondary">{outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="glass-card p-4">
            <h4 className="fw-bold text-white mb-3 brand-font">Course Instructor</h4>
            <div className="d-flex align-items-center gap-3">
              <img
                src={course.instructor?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}&background=3b82f6&color=fff`}
                alt={course.instructor?.name}
                className="rounded-circle"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="fw-bold text-white mb-1">{course.instructor?.name}</h5>
                <p className="text-secondary small mb-0">
                  {course.instructor?.bio || 'Experienced engineering instructor dedicated to practical, hands-on software development.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Checkout Card */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '100px' }}>
            <GlassCard className="p-4 shadow-lg border-opacity-50">
              {/* Media Preview */}
              <div className="rounded-3 overflow-hidden mb-4" style={{ height: '190px' }}>
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Price */}
              <div className="d-flex align-items-baseline gap-2 mb-3">
                <span className="display-6 fw-bold text-white">
                  ₹{Number(course.price).toFixed(2)}
                </span>
                <span className="text-muted small">{isInstructorOwner ? 'Course price' : 'One-time demo fee'}</span>
              </div>

              {/* Status or Action Button */}
              {isInstructorOwner ? (
                <div>
                  <div className="glass-panel p-3 mb-3 d-flex align-items-center gap-2 text-info">
                    <ShieldCheck size={20} />
                    <span className="fw-semibold small">This is your course</span>
                  </div>
                </div>
              ) : isEnrolled ? (
                <div>
                  <div className="glass-panel p-3 mb-3 d-flex align-items-center gap-2 text-success">
                    <CheckCircle2 size={20} />
                    <span className="fw-semibold small">You are enrolled in this course</span>
                  </div>
                  <Link to="/student-dashboard" className="glass-btn glass-btn-success w-100 py-3 text-center d-block">
                    Go to My Learning
                  </Link>
                </div>
              ) : (
                <div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 py-3 mb-3"
                    onClick={handleEnrollClick}
                    icon={Sparkles}
                  >
                    {isAuthenticated ? 'Enroll with Demo Payment' : 'Log In to Enroll'}
                  </Button>

                  <div className="small text-muted text-center d-flex align-items-center justify-content-center gap-1 mb-3">
                    <ShieldCheck size={14} className="text-info" />
                    <span>No credit card required (Simulation)</span>
                  </div>
                </div>
              )}

              {/* Instructor Edit Action */}
              {isOwner && (
                <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                  <Link
                    to={`/courses/${course.id}/edit`}
                    className="glass-btn w-100 py-2 text-center text-info small d-block"
                  >
                    Edit Course Details
                  </Link>
                </div>
              )}

              {/* Features Included List */}
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-start">
                <h6 className="fw-bold text-white small mb-3">This course includes:</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-0">
                  <li className="d-flex align-items-center gap-2">
                    <BookOpen size={15} className="text-primary" /> Full lifetime access
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <Layers size={15} className="text-primary" /> Interactive coding modules
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <ShieldCheck size={15} className="text-primary" /> Certificate of completion
                  </li>
                </ul>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={course}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CourseDetailPage;
