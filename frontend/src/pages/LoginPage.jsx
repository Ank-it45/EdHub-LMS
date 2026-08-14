import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, GraduationCap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/courses';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      if (user.role === 'INSTRUCTOR') {
        navigate('/instructor-dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate(from === '/login' ? '/student-dashboard' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-80">
      <div className="w-100" style={{ maxWidth: '460px' }}>
        <GlassCard className="p-4 p-md-5 text-center shadow-lg">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: '#ffffff',
            }}
          >
            <GraduationCap size={32} />
          </div>

          <h2 className="fw-bold text-white mb-1 brand-font">Welcome Back</h2>
          <p className="text-muted small mb-4">Log in to access your courses and dashboard</p>

          <ErrorMessage message={error} onDismiss={() => setError('')} />

          <form onSubmit={handleSubmit} className="text-start">
            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 mt-2 py-2.5"
              loading={loading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-start">
            <div className="small text-muted mb-2 d-flex align-items-center gap-1">
              <Sparkles size={14} className="text-warning" />
              <span>Quick Demo Accounts (One-Click Fill):</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-info flex-grow-1"
                onClick={() => handleQuickLogin('ankit.student@edhub.dev', 'Password123!')}
              >
                Student Demo
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary flex-grow-1"
                onClick={() => handleQuickLogin('priya.dev@edhub.dev', 'Password123!')}
              >
                Instructor Demo
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-warning flex-grow-1"
                onClick={() => handleQuickLogin('admin@edhub.dev', 'Password123!')}
              >
                Admin Demo
              </button>
            </div>
          </div>

          <p className="text-muted small mt-4 mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              Create an account
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default LoginPage;
