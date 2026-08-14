import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, GraduationCap, Briefcase } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const { user: currentUser, register, registerAsInstructor } = useAuth();
  const isInstructorUpgrade = Boolean(currentUser?.role === 'STUDENT' && location.state?.mode === 'INSTRUCTOR_UPGRADE');
  const [role, setRole] = useState(isInstructorUpgrade || location.state?.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isInstructorUpgrade) {
      try {
        setLoading(true);
        await registerAsInstructor(bio.trim());
        navigate('/student-dashboard');
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Instructor registration failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const user = await register(name.trim(), email.trim(), password, role, bio.trim());
      if (user.role === 'INSTRUCTOR') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-80">
      <div className="w-100" style={{ maxWidth: '520px' }}>
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

          <h2 className="fw-bold text-white mb-1 brand-font">{isInstructorUpgrade ? 'Register as an Instructor' : 'Join EdHub'}</h2>
          <p className="text-muted small mb-4">{isInstructorUpgrade ? 'Add instructor access to your existing EdHub account.' : 'Start learning or teaching modern technical skills'}</p>

          <ErrorMessage message={error} onDismiss={() => setError('')} />

          {/* Role Switcher */}
          {!isInstructorUpgrade && <div className="d-flex gap-2 p-1 rounded-3 glass-panel mb-4">
            <button
              type="button"
              className={`btn flex-grow-1 py-2 rounded-2 d-flex align-items-center justify-content-center gap-2 small ${
                role === 'STUDENT'
                  ? 'btn-primary fw-semibold text-white'
                  : 'btn-link text-secondary text-decoration-none'
              }`}
              onClick={() => setRole('STUDENT')}
            >
              <GraduationCap size={16} /> I want to Learn (Student)
            </button>
            <button
              type="button"
              className={`btn flex-grow-1 py-2 rounded-2 d-flex align-items-center justify-content-center gap-2 small ${
                role === 'INSTRUCTOR'
                  ? 'btn-primary fw-semibold text-white'
                  : 'btn-link text-secondary text-decoration-none'
              }`}
              onClick={() => setRole('INSTRUCTOR')}
            >
              <Briefcase size={16} /> I want to Teach (Instructor)
            </button>
          </div>}

          <form onSubmit={handleSubmit} className="text-start">
            <Input
              label="Full Name"
              id="name"
              placeholder="e.g. Alex Johnson"
              value={isInstructorUpgrade ? (currentUser?.name || '') : name}
              onChange={(e) => setName(e.target.value)}
              disabled={isInstructorUpgrade}
              icon={User}
              required
            />

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="alex@domain.com"
              value={isInstructorUpgrade ? (currentUser?.email || '') : email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInstructorUpgrade}
              icon={Mail}
              required
            />

            {!isInstructorUpgrade && <Input
              label="Password (min. 6 characters)"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />}

            {role === 'INSTRUCTOR' && (
              <Input
                label="Instructor Bio & Expertise"
                id="bio"
                as="textarea"
                rows={3}
                placeholder="Briefly introduce your engineering background and domain expertise..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 mt-3 py-2.5"
              loading={loading}
              icon={UserPlus}
            >
              Create Account
            </Button>
          </form>

          <p className="text-muted small mt-4 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Log in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default RegisterPage;
