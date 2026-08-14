import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export const NotFoundPage = () => {
  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-75">
      <div className="w-100" style={{ maxWidth: '520px' }}>
        <GlassCard className="p-5 text-center shadow-lg">
          <div className="display-1 fw-bold text-gradient brand-font mb-2">404</div>
          <h3 className="fw-bold text-white mb-2 brand-font">Page Not Found</h3>
          <p className="text-muted mb-4">
            The page you are looking for might have been moved, removed, or never existed.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="glass-btn glass-btn-primary py-2.5 px-4 text-white">
              <Home size={17} /> Return Home
            </Link>
            <Link to="/courses" className="glass-btn py-2.5 px-4 text-secondary">
              Browse Courses
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default NotFoundPage;
