import React, { useState, useEffect } from 'react';
import { User, Mail, UploadCloud, CheckCircle2, Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setAvatarUrl(res.data.data.url);
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setError('Failed to upload avatar media');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      setLoading(true);
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 text-start">
      <div className="w-100 mx-auto" style={{ maxWidth: '640px' }}>
        <GlassCard className="p-4 p-md-5 shadow-lg">
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div className="position-relative">
              <img
                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=3b82f6&color=fff`}
                alt={name}
                className="rounded-circle border border-2 border-primary"
                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h3 className="fw-bold text-white brand-font mb-0">{user?.name}</h3>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="glass-badge glass-badge-primary small py-0.5">
                  <Shield size={13} /> {user?.role}
                </span>
                <span className="text-muted small">{user?.email}</span>
              </div>
            </div>
          </div>

          <ErrorMessage message={error} onDismiss={() => setError('')} />

          {successMsg && (
            <div className="glass-panel p-3 mb-3 d-flex align-items-center gap-2 text-success" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle2 size={18} />
              <span className="small fw-semibold">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />

            <div className="mb-3">
              <label className="form-label">Email Address (Read-only)</label>
              <div className="position-relative">
                <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="form-control glass-input ps-5 opacity-75 cursor-not-allowed"
                />
              </div>
            </div>

            <Input
              label="Avatar Media URL"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />

            <div className="mb-4">
              <label className="glass-btn glass-btn-primary py-1.5 px-3 small cursor-pointer m-0">
                <UploadCloud size={16} />
                <span>{uploading ? 'Uploading...' : 'Upload New Avatar to Cloudinary'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
            </div>

            <Input
              label="Bio / Professional Summary"
              id="bio"
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a short summary about yourself..."
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 mt-2"
              loading={loading || uploading}
            >
              Save Profile Changes
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;
