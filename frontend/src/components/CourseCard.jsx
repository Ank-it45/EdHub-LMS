import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import GlassCard from './GlassCard';

export const CourseCard = ({ course, isEnrolled = false, onEnrollClick }) => {
  const fallbackThumb = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

  return (
    <GlassCard hover className="h-100 d-flex flex-column p-0 overflow-hidden border-opacity-25">
      {/* Thumbnail Container */}
      <div className="position-relative" style={{ height: '180px', overflow: 'hidden' }}>
        <img
          src={course.thumbnailUrl || fallbackThumb}
          alt={course.title}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onError={(e) => {
            e.target.src = fallbackThumb;
          }}
        />
        {/* Category & Level Badges */}
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="glass-badge glass-badge-primary small">
            {course.category || 'General'}
          </span>
          <span className="glass-badge small">
            {course.level || 'All Levels'}
          </span>
        </div>

        {isEnrolled && (
          <div className="position-absolute top-0 end-0 m-3">
            <span className="glass-badge glass-badge-success small">
              <CheckCircle2 size={14} /> Enrolled
            </span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold text-white mb-2 text-truncate" title={course.title}>
          {course.title}
        </h5>

        <p className="text-secondary small flex-grow-1 line-clamp-2 mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.description}
        </p>

        {/* Instructor Info & Stats */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25 mt-auto">
          <div className="d-flex align-items-center gap-2">
            <img
              src={course.instructor?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}&background=3b82f6&color=fff`}
              alt={course.instructor?.name}
              className="rounded-circle"
              style={{ width: '28px', height: '28px', objectFit: 'cover' }}
            />
            <span className="small text-muted text-truncate" style={{ maxWidth: '110px' }}>
              {course.instructor?.name || 'Instructor'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-1 text-muted small">
            <Users size={14} />
            <span>{course._count?.enrollments || 0}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="d-flex align-items-center justify-content-between mt-3 pt-2">
          <div className="fs-5 fw-bold text-white">
            {course.price === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              `₹${Number(course.price).toFixed(2)}`
            )}
          </div>

          {isEnrolled ? (
            <Link to={`/courses/${course.id}`} className="glass-btn glass-btn-success py-1.5 px-3 small">
              Continue <ArrowRight size={14} />
            </Link>
          ) : (
            <Link to={`/courses/${course.id}`} className="glass-btn glass-btn-primary py-1.5 px-3 small">
              View Details <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default CourseCard;
