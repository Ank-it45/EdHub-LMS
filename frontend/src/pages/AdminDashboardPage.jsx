import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  CreditCard,
  DollarSign,
  Calendar
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

export const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'users'

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [usersRes, ordersRes, coursesRes] = await Promise.all([
          api.get('/users'),
          api.get('/orders'),
          api.get('/courses'),
        ]);

        if (usersRes.data.success) setUsers(usersRes.data.data);
        if (ordersRes.data.success) setOrders(ordersRes.data.data);
        if (coursesRes.data.success) setCourses(coursesRes.data.data);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const totalVolume = orders
    .filter((o) => o.status === 'PLACED')
    .reduce((acc, o) => acc + (o.amount || 0), 0);

  return (
    <div className="container py-5 text-start">
      {/* Header */}
      <div className="glass-card p-4 p-md-5 mb-4">
        <div className="glass-badge glass-badge-primary mb-2">Platform Administration</div>
        <h1 className="fw-bold text-white brand-font mb-1">System Governance & Audit</h1>
        <p className="text-secondary mb-0">
          Global platform overview, user directory, courses oversight, and complete mock transaction ledgers.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <Users size={22} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <div className="text-muted small">Total Users</div>
                <div className="fs-4 fw-bold text-white">{users.length}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <BookOpen size={22} style={{ color: '#22d3ee' }} />
              </div>
              <div>
                <div className="text-muted small">Total Courses</div>
                <div className="fs-4 fw-bold text-white">{courses.length}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <CreditCard size={22} style={{ color: '#fbbf24' }} />
              </div>
              <div>
                <div className="text-muted small">Total Orders</div>
                <div className="fs-4 fw-bold text-white">{orders.length}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="col-sm-6 col-lg-3">
          <GlassCard className="p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-tile-neutral p-3 rounded-3 d-inline-flex align-items-center justify-content-center">
                <DollarSign size={22} style={{ color: '#34d399' }} />
              </div>
              <div>
                <div className="text-muted small">Simulated Volume</div>
                <div className="fs-4 fw-bold text-white">₹{totalVolume.toFixed(2)}</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom border-secondary border-opacity-25 mb-4 pb-1">
        <button
          className={`btn py-2 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-white border-bottom border-primary border-2 active-tab-glass'
              : 'text-muted'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <CreditCard size={18} />
          <span>All Platform Orders ({orders.length})</span>
        </button>

        <button
          className={`btn py-2 px-3 fw-semibold border-0 d-flex align-items-center gap-2 ${
            activeTab === 'users'
              ? 'text-white border-bottom border-primary border-2 active-tab-glass'
              : 'text-muted'
          }`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>User Directory ({users.length})</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Loading platform records..." />
      ) : activeTab === 'orders' ? (
        /* Orders Table */
        <div className="glass-card p-0 overflow-hidden">
          {orders.length === 0 ? (
            <EmptyState icon={CreditCard} title="No platform orders recorded" />
          ) : (
            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Order Status</th>
                    <th>Payment Status</th>
                    <th>Mock Txn ID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="small text-muted">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="fw-semibold text-white">{ord.user?.name}</div>
                        <span className="small text-muted">{ord.user?.email}</span>
                      </td>
                      <td className="fw-medium text-white">{ord.course?.title}</td>
                      <td className="fw-bold text-white">₹{Number(ord.amount).toFixed(2)}</td>
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
      ) : (
        /* Users Table */
        <div className="glass-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Courses</th>
                  <th>Enrollments</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=3b82f6&color=fff`}
                          alt={u.name}
                          className="rounded-circle"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold text-white">{u.name}</div>
                          <span className="small text-muted">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`glass-badge ${
                          u.role === 'ADMIN'
                            ? 'glass-badge-warning'
                            : u.role === 'INSTRUCTOR'
                            ? 'glass-badge-primary'
                            : 'glass-badge-success'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="fw-medium text-white">{u._count?.courses || 0}</td>
                    <td className="fw-medium text-white">{u._count?.enrollments || 0}</td>
                    <td className="fw-medium text-white">{u._count?.orders || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
