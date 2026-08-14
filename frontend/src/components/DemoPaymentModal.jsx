import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import api from '../services/api';

export const DemoPaymentModal = ({
  isOpen,
  onClose,
  course,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState('');
  const [statusStep, setStatusStep] = useState('review'); // 'review', 'paying', 'success', 'failed'

  // Initialize pending order when modal opens or user reviews
  const handleInitiateOrder = async () => {
    if (!course) return;
    try {
      setLoading(true);
      setError('');
      // POST /api/orders -> creates order (server reads price from DB)
      const res = await api.post('/orders', { courseId: course.id });
      if (res.data.success) {
        setOrder(res.data.data);
        setStatusStep('review');
      }
    } catch (err) {
      console.error('Order initialization failed:', err);
      setError(err.response?.data?.message || 'Failed to initialize order');
    } finally {
      setLoading(false);
    }
  };

  // Triggered when modal opens
  React.useEffect(() => {
    if (isOpen && course) {
      setOrder(null);
      setPaymentResult(null);
      setError('');
      setStatusStep('review');
      handleInitiateOrder();
    }
  }, [isOpen, course]);

  // Simulate Payment Confirmation via Backend
  const handleConfirmMockPay = async () => {
    if (!order) return;
    try {
      setLoading(true);
      setStatusStep('paying');
      setError('');

      // Call backend to execute simulated payment logic
      const res = await api.post(`/orders/${order.id}/mock-pay`);

      if (res.data.success) {
        setPaymentResult(res.data.data);
        setStatusStep('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(res.data.data);
        }
      }
    } catch (err) {
      console.error('Mock payment failed:', err);
      setError(err.response?.data?.message || 'Payment simulation failed');
      setStatusStep('failed');
    } finally {
      setLoading(false);
    }
  };

  // Simulate Cancelation
  const handleCancelOrder = async () => {
    if (!order) {
      onClose();
      return;
    }
    try {
      setLoading(true);
      await api.post(`/orders/${order.id}/cancel`);
    } catch (err) {
      console.error('Order cancellation note:', err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  // Simulate Failed Payment Flow for testing
  const handleSimulateFailure = () => {
    setError('Simulated payment failure (insufficient test funds / transaction rejected). No enrollment created.');
    setStatusStep('failed');
  };

  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={statusStep === 'paying' ? undefined : onClose}
      title={statusStep === 'success' ? 'Payment Completed' : 'Checkout & Simulated Payment'}
      maxWidth="540px"
    >
      {/* Required Canonical Notice: Demonstration Mode */}
      <div
        className="glass-panel p-3 mb-3 d-flex align-items-center gap-3 text-start"
        style={{
          background: 'rgba(59, 130, 246, 0.12)',
          borderColor: 'rgba(59, 130, 246, 0.35)',
        }}
      >
        <Info size={24} className="text-info flex-shrink-0" />
        <div className="small">
          <strong className="text-white d-block">Demo Payment Simulator</strong>
          <span className="text-secondary">
            This is a simulated transaction. <strong>No real money is charged</strong>. Your enrollment will be activated upon backend confirmation.
          </span>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Step: Success */}
      {statusStep === 'success' && paymentResult ? (
        <div className="text-center py-3">
          <div
            className="rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
            }}
          >
            <CheckCircle2 size={48} />
          </div>

          <h3 className="fw-bold text-white mb-2 brand-font">Order placed successfully!</h3>
          <p className="text-secondary small mb-4">
            Your course access has been activated and added to your learning dashboard.
          </p>

          {/* Receipt Card */}
          <div className="glass-panel p-3 text-start mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Transaction ID</span>
              <span className="badge bg-secondary font-monospace text-info">
                {paymentResult.transactionId}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Course</span>
              <span className="fw-medium text-white text-truncate" style={{ maxWidth: '280px' }}>
                {course.title}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Amount Paid</span>
              <span className="fw-bold text-success">
                ₹{Number(course.price).toFixed(2)}
              </span>
            </div>
            <div className="d-flex justify-content-between pt-2 border-top border-secondary border-opacity-25">
              <span className="text-muted small">Status</span>
              <span className="glass-badge glass-badge-success small py-0.5">
                <ShieldCheck size={14} /> Confirmed by Server
              </span>
            </div>
          </div>

          <Button
            variant="success"
            size="lg"
            className="w-100"
            onClick={onClose}
            icon={ArrowRight}
          >
            Access Course Now
          </Button>
        </div>
      ) : (
        /* Step: Review / Paying / Failed */
        <div className="text-start">
          {/* Course Summary */}
          <div className="glass-panel p-3 mb-4 d-flex gap-3 align-items-center">
            <img
              src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80'}
              alt={course.title}
              className="rounded-3"
              style={{ width: '80px', height: '60px', objectFit: 'cover' }}
            />
            <div className="flex-grow-1 overflow-hidden">
              <h6 className="fw-bold text-white mb-1 text-truncate">{course.title}</h6>
              <div className="small text-muted">Instructor: {course.instructor?.name || 'EdHub Team'}</div>
            </div>
            <div className="text-end">
              <div className="fs-5 fw-bold text-white">₹{Number(course.price).toFixed(2)}</div>
            </div>
          </div>

          {/* Payment Method Details (Mock Visual) */}
          <div className="glass-panel p-3 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-semibold text-white small d-flex align-items-center gap-2">
                <CreditCard size={17} className="text-primary" />
                Simulated Payment Gateway
              </span>
              <span className="glass-badge glass-badge-primary small py-0.5">
                <Lock size={12} /> Sandbox Mode
              </span>
            </div>
            <p className="text-muted small mb-0">
              Card: •••• •••• •••• 4242 &nbsp;|&nbsp; Exp: 12/28 &nbsp;|&nbsp; CVC: 123
            </p>
          </div>

          {/* Order Total Breakdown */}
          <div className="mb-4">
            <div className="d-flex justify-content-between text-secondary small mb-1">
              <span>Course Tuition</span>
              <span>₹{Number(course.price).toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between text-secondary small mb-2">
              <span>Platform & Processing Fee</span>
              <span className="text-success">₹0.00 (Demo)</span>
            </div>
            <div className="d-flex justify-content-between fw-bold text-white fs-5 pt-2 border-top border-secondary border-opacity-25">
              <span>Total Amount</span>
              <span className="text-gradient">₹{Number(course.price).toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex flex-column gap-2 mt-4">
            <Button
              variant="success"
              size="lg"
              className="w-100"
              loading={loading}
              onClick={handleConfirmMockPay}
              icon={Sparkles}
            >
              Confirm Simulated Payment (₹{Number(course.price).toFixed(2)})
            </Button>

            <div className="d-flex gap-2 mt-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger w-50 py-2"
                onClick={handleSimulateFailure}
                disabled={loading}
              >
                Simulate Payment Failure
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary w-50 py-2"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DemoPaymentModal;
