import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Plus, Trash2, Sparkles } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import api from '../services/api';

export const CourseForm = ({ initialData = {}, onSubmit, loading = false, isEdit = false }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [price, setPrice] = useState(initialData.price !== undefined ? initialData.price : '49.99');
  const [category, setCategory] = useState(initialData.category || 'Development');
  const [level, setLevel] = useState(initialData.level || 'Beginner');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl || '');
  const [learningOutcomes, setLearningOutcomes] = useState(
    Array.isArray(initialData.learningOutcomes) && initialData.learningOutcomes.length > 0
      ? initialData.learningOutcomes
      : [
    'Architect scalable full-stack applications with clean separation of concerns.',
    'Implement secure JWT token verification & server-side RBAC authorization.',
    'Model relational databases, unique constraints, and atomic transactions.',
    'Design modern glassmorphic responsive interfaces with Bootstrap 5.'
  ]
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Development', 'DevOps', 'Database', 'Design', 'Security', 'Business', 'AI & Data Science'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'courses');

      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setThumbnailUrl(response.data.data.url);
      }
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Course title is required');
      return;
    }
    if (!description.trim()) {
      setError('Course description is required');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please provide a valid non-negative price');
      return;
    }

    const cleanedOutcomes = learningOutcomes.map((item) => item.trim()).filter(Boolean);
    if (cleanedOutcomes.length === 0) {
      setError("Add at least one learning outcome for What You'll Master");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      category,
      level,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      learningOutcomes: cleanedOutcomes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="text-start">
      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <Input
        label="Course Title"
        id="title"
        placeholder="e.g. Master Modern Full-Stack Development"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Description"
        id="description"
        as="textarea"
        rows={5}
        placeholder="Describe what students will learn, prerequisites, and key outcomes..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="row g-3">
        <div className="col-md-4">
          <Input
            label="Price (₹ INR)"
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="49.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className="form-select glass-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="level" className="form-label">
              Difficulty Level
            </label>
            <select
              id="level"
              className="form-select glass-input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Editable What You'll Master / Learning Outcomes */}
      <div className="glass-panel p-3 mb-4 mt-2">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <label className="form-label d-flex align-items-center gap-2 mb-1">
              <Sparkles size={17} className="text-warning" /> What You'll Master
            </label>
            <div className="text-secondary small">Add the key outcomes students will master in this course.</div>
          </div>
          <button
            type="button"
            className="glass-btn glass-btn-primary py-1 px-2 small d-inline-flex align-items-center gap-1"
            onClick={() => setLearningOutcomes((items) => [...items, ''])}
          >
            <Plus size={15} /> Add Outcome
          </button>
        </div>

        <div className="d-flex flex-column gap-2">
          {learningOutcomes.map((outcome, index) => (
            <div key={`outcome-${index}`} className="d-flex align-items-center gap-2">
              <span className="text-success fw-semibold small" style={{ minWidth: '22px' }}>{index + 1}.</span>
              <input
                type="text"
                className="form-control glass-input"
                value={outcome}
                onChange={(e) => {
                  const next = [...learningOutcomes];
                  next[index] = e.target.value;
                  setLearningOutcomes(next);
                }}
                placeholder="e.g. Build production-ready REST APIs with secure authentication."
              />
              {learningOutcomes.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                  onClick={() => setLearningOutcomes((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label={`Remove outcome ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail Upload & URL Section */}
      <div className="glass-panel p-3 mb-4 mt-2">
        <label className="form-label d-block mb-2">Course Thumbnail Media</label>

        <div className="row align-items-center g-3">
          <div className="col-md-7">
            <Input
              label="Thumbnail Image URL (or upload below)"
              id="thumbnailUrl"
              placeholder="https://images.unsplash.com/..."
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              icon={ImageIcon}
            />

            <div className="d-flex align-items-center gap-2">
              <label className="glass-btn glass-btn-primary py-1.5 px-3 small cursor-pointer m-0">
                <UploadCloud size={16} />
                <span>{uploading ? 'Uploading...' : 'Upload Media to Cloudinary'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </label>
              {uploading && <span className="spinner-border spinner-border-sm text-primary"></span>}
            </div>
          </div>

          <div className="col-md-5 text-center">
            <div
              className="rounded-3 overflow-hidden border border-secondary border-opacity-25 d-flex align-items-center justify-content-center mx-auto"
              style={{
                width: '100%',
                maxWidth: '220px',
                height: '130px',
                background: 'rgba(15, 23, 42, 0.5)',
              }}
            >
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="text-muted small d-flex flex-column align-items-center">
                  <ImageIcon size={28} className="mb-1 opacity-50" />
                  <span>Preview Thumbnail</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading || uploading}
          className="px-4"
        >
          {isEdit ? 'Update Course' : 'Publish Course'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
