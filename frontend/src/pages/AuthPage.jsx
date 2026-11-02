import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ListTodo
} from 'lucide-react';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      const errMsg = 
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (err.response?.data?.email && err.response.data.email[0]) ||
        (err.response?.data?.non_field_errors && err.response.data.non_field_errors[0]) ||
        err.message ||
        'Authentication failed. Please verify your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setIsRegister(false);
    setEmail('demo@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 35px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        border: '1px solid #e2e8f0',
        minHeight: '620px'
      }}>
        {/* Left Side: Brand & Visual Banner */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          color: '#ffffff',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ListTodo size={24} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>TaskFlow</span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '18px' }}>
              Organize your tasks with clarity & focus.
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Smart dashboard metrics, Kanban status management, calendar deadlines, and powerful filters built with Django REST Framework and React.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', padding: '6px' }}>
                  <CheckCircle2 size={16} color="#a7f3d0" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#e0e7ff' }}>Secure Django JWT Token Authentication</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', padding: '6px' }}>
                  <ShieldCheck size={16} color="#a7f3d0" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#e0e7ff' }}>Strict user-level data isolation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '50%', padding: '6px' }}>
                  <Zap size={16} color="#a7f3d0" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#e0e7ff' }}>PostgreSQL relational task management</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#c7d2fe', marginBottom: '4px', fontWeight: '700' }}>
              Quick Demo Access
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>demo@example.com / password123</span>
              <button
                type="button"
                onClick={handleDemoFill}
                style={{
                  background: '#ffffff',
                  color: '#4338ca',
                  fontWeight: '700',
                  fontSize: '0.78rem',
                  padding: '5px 10px',
                  borderRadius: '6px'
                }}
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form (Login or Register) */}
        <div style={{
          flex: '1.1',
          padding: '48px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
              {isRegister
                ? 'Fill in your details below to start tracking your tasks.'
                : 'Enter your credentials to access your task dashboard.'}
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              marginBottom: '20px',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon-left" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon-left" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ background: 'transparent', border: 'none' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#64748b'
          }}>
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  style={{ color: '#4f46e5', fontWeight: '700' }}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  style={{ color: '#4f46e5', fontWeight: '700' }}
                >
                  Create one now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
