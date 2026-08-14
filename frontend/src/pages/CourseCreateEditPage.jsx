import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CourseForm from '../components/CourseForm';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

export const CourseCreateEditPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/courses/${id}`);
          if (res.data.success) {
            setInitialData(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load course for editing:', err);
          setError('Failed to load course details');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);
      setError('');

      if (isEdit) {
        const res = await api.patch(`/courses/${id}`, formData);
        if (res.data.success) {
          navigate(`/courses/${id}`);
        }
      } else {
        const res = await api.post('/courses', formData);
        if (res.data.success) {
          navigate(`/courses/${res.data.data.id}`);
        }
      }
    } catch (err) {
      console.error('Course save failed:', err);
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container py-5 text-start">
      <div className="mb-4">
        <Link
          to="/instructor-dashboard"
          className="text-secondary text-decoration-none small d-inline-flex align-items-center gap-2 hover-light"
        >
          <ArrowLeft size={16} /> Back to Instructor Studio
        </Link>
      </div>

      <div className="w-100 mx-auto" style={{ maxWidth: '820px' }}>
        <GlassCard className="p-4 p-md-5 shadow-lg">
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="fw-bold text-white brand-font mb-0">
                {isEdit ? 'Edit Course Curriculum' : 'Create New Course'}
              </h2>
              <p className="text-secondary small mb-0">
                {isEdit
                  ? 'Update course details, price, description, and thumbnail media'
                  : 'Publish a brand-new course to the EdHub learning catalog'}
              </p>
            </div>
          </div>

          <ErrorMessage message={error} onDismiss={() => setError('')} />

          {loading ? (
            <Loader message="Loading course editor..." />
          ) : (
            <CourseForm
              initialData={initialData || {}}
              onSubmit={handleSubmit}
              loading={submitLoading}
              isEdit={isEdit}
            />
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default CourseCreateEditPage;
