import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'orders'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [enrollRes, orderRes] = await Promise.all([
          api.get('/enrollments/me'),
          api.get('/orders/me'),
        ]);

        if (enrollRes.data.success) {
          setEnrollments(enrollRes.data.data);
        }
        if (orderRes.data.success) {
          setOrders(orderRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container py-5 text-start">
      {/* Header Banner */}
      <div className="glass-card p-4 p-md-5 mb-4 position-relative overflow-hidden">
        <div className="row align-items-center g-4">
          <div className="col-md-8">
            <div className="glass-badge glass-badge-primary mb-2">Student Portal</div>
            <h1 className="fw-bold text-white brand-font mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-secondary mb-0">
              Track your enrolled engineering curriculums, review lesson progress, and inspect verified mock transaction receipts.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <Link to="/courses" className="glass-btn glass-btn-primary py-2.5 px-4 text-white">
              <Sparkles size={17} /> Explore More Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-25 mb-4 pb-1">
        <button
          className={`btn py-2 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${
            activeTab === 'courses'
              ? 'text-white border-bottom border-primary border-2 active-tab-glass'
              : 'text-muted'
          }`}
          onClick={() => setActiveTab('courses')}
        >
          <BookOpen size={18} />
          <span>My Enrolled Courses ({enrollments.length})</span>
        </button>

        <button
          className={`btn py-2 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-white border-bottom border-primary border-2 active-tab-glass'
              : 'text-muted'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <CreditCard size={18} />
          <span>Payment & Order History ({orders.length})</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading your student records..." />
      ) : activeTab === 'courses' ? (
        <div>
          {enrollments.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses enrolled yet"
              description="Browse our course catalog and enroll in your first course using our simulated checkout."
              actionText="Browse Courses"
              onAction={() => window.location.assign('/courses')}
            />
          ) : (
            <div className="row g-4">
              {enrollments.map((enr) => (
                <div key={enr.id} className="col-md-6 col-lg-4">
                  <CourseCard course={enr.course} isEnrolled={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Orders & Payment History Tab */
        <div className="glass-card p-0 overflow-hidden">
          {orders.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No transactions found"
              description="When you place a mock order for a course, your transaction receipts will appear here."
            />
          ) : (
            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Amount</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="small text-muted">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="fw-semibold text-white">{ord.course?.title}</div>
                        <span className="small text-muted">{ord.course?.category}</span>
                      </td>
                      <td>
                        <span
                          className={`glass-badge ${
                            ord.status === 'PLACED'
                              ? 'glass-badge-success'
                              : ord.status === 'CANCELLED'
                              ? 'glass-badge-danger'
                              : 'glass-badge-warning'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`glass-badge ${
                            ord.payment?.status === 'SUCCESS'
                              ? 'glass-badge-success'
                              : ord.payment?.status === 'CANCELLED'
                              ? 'glass-badge-danger'
                              : 'glass-badge-warning'
                          }`}
                        >
                          {ord.payment?.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="fw-bold text-white">₹{Number(ord.amount).toFixed(2)}</td>
                      <td>
                        {ord.payment?.transactionId ? (
                          <span className="badge bg-dark font-monospace text-info small">
                            {ord.payment.transactionId}
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
