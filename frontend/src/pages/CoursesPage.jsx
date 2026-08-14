import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const CoursesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('newest');

  const categories = ['All', 'Development', 'DevOps', 'Database', 'Design', 'Security', 'AI & Data Science'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch Courses with params
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (level !== 'All') params.level = level;
      if (sort) params.sort = sort;

      const res = await api.get('/courses', { params });
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student enrollments if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/enrollments/me')
        .then((res) => {
          if (res.data.success) {
            const ids = new Set(res.data.data.map((enr) => enr.courseId));
            setEnrolledCourseIds(ids);
          }
        })
        .catch((err) => console.error('Failed to fetch user enrollments:', err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCourses();
  }, [category, level, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-start mb-4">
        <div className="glass-badge glass-badge-primary mb-2">Course Catalog</div>
        <h1 className="fw-bold text-white brand-font">Explore In-Demand Engineering Courses</h1>
        <p className="text-muted">
          Browse comprehensive courses designed by experts to elevate your development expertise.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 mb-4 text-start">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-lg-5">
            <form onSubmit={handleSearchSubmit}>
              <div className="position-relative">
                <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  className="form-control glass-input ps-5"
                  placeholder="Search by keywords, titles, or concepts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Category Filter */}
          <div className="col-sm-6 col-lg-2">
            <select
              className="form-select glass-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="col-sm-6 col-lg-2">
            <select
              className="form-select glass-input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === 'All' ? 'All Levels' : lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="col-lg-3">
            <select
              className="form-select glass-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Course Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <Loader message="Loading courses..." />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses match your filter"
          description="Try broadening your search query or selecting a different category or level filter."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setCategory('All');
            setLevel('All');
            setSort('newest');
          }}
        />
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <CourseCard
                course={course}
                isEnrolled={enrolledCourseIds.has(course.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
