import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as authLogin, saveUser } from '../services/authService';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authLogin({ email, password, role });
      saveUser(userData);

      if (userData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🎓</div>
          <span style={styles.brandName}>CareerFair</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account to continue</p>

        <div style={styles.toggleWrap}>
          {['student', 'admin'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{ ...styles.toggleBtn, ...(role === r ? styles.toggleActive : {}) }}
            >
              {r === 'student' ? '🎓 Student' : '⚙️ Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email address</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldWrap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={styles.label}>Password</label>
              <button type="button" onClick={() => {}} style={styles.forgotLink}>Forgot password?</button>
            </div>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
              />
              <button type="button" onClick={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              <>Sign in as {role === 'admin' ? 'Admin' : 'Student'} →</>
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>new here?</span>
          <span style={styles.dividerLine} />
        </div>

        <p style={styles.registerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.registerLink}>Create one free</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F5F7FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  blob1: {
    position: 'fixed', top: -120, right: -80, width: 400, height: 400,
    borderRadius: '50%', background: 'radial-gradient(circle, #C7D7FF 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', bottom: -100, left: -60, width: 360, height: 360,
    borderRadius: '50%', background: 'radial-gradient(circle, #D4F1E4 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#ffffff',
    borderRadius: 24,
    padding: '48px 44px',
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(99,102,241,0.10)',
    border: '1px solid #E8ECFF',
    position: 'relative',
    zIndex: 1,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    justifyContent: 'center', marginBottom: 28,
  },
  brandIcon: { fontSize: 28 },
  brandName: {
    fontSize: 20, fontWeight: 700, color: '#1e293b',
    fontFamily: "'Georgia', serif", letterSpacing: '-0.3px',
  },
  title: {
    fontSize: 30, fontWeight: 700, color: '#0f172a',
    margin: '0 0 6px', textAlign: 'center', letterSpacing: '-0.5px',
    fontFamily: "'Georgia', serif",
  },
  subtitle: {
    fontSize: 14, color: '#64748b', textAlign: 'center',
    margin: '0 0 28px', fontFamily: 'system-ui, sans-serif',
  },
  toggleWrap: {
    display: 'flex', background: '#F1F5F9', borderRadius: 12,
    padding: 4, marginBottom: 28, gap: 4,
  },
  toggleBtn: {
    flex: 1, padding: '9px 0', border: 'none', background: 'transparent',
    borderRadius: 9, fontSize: 13, fontWeight: 600, color: '#64748b',
    cursor: 'pointer', fontFamily: 'system-ui, sans-serif', transition: 'all 0.2s',
  },
  toggleActive: {
    background: '#ffffff', color: '#4F46E5',
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 13, fontWeight: 600, color: '#374151',
    fontFamily: 'system-ui, sans-serif',
  },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: 0,
    border: '1.5px solid #E2E8F0', borderRadius: 11, overflow: 'hidden',
    background: '#FAFBFF', transition: 'border-color 0.2s',
  },
  inputIcon: {
    padding: '0 12px', fontSize: 15, userSelect: 'none',
    borderRight: '1px solid #E2E8F0', background: '#F8FAFF',
    height: '100%', display: 'flex', alignItems: 'center', minHeight: 44,
  },
  input: {
    flex: 1, padding: '12px 14px', border: 'none', outline: 'none',
    fontSize: 14, color: '#1e293b', background: 'transparent',
    fontFamily: 'system-ui, sans-serif',
  },
  eyeBtn: {
    padding: '0 12px', border: 'none', background: 'transparent',
    cursor: 'pointer', fontSize: 15,
  },
  forgotLink: {
    fontSize: 12, color: '#4F46E5', fontWeight: 600,
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
    padding: 0,
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#B91C1C',
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: 13,
    fontFamily: 'system-ui, sans-serif',
  },
  submitBtn: {
    marginTop: 6, padding: '14px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif', letterSpacing: '0.2px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(79,70,229,0.35)', transition: 'opacity 0.2s',
    minHeight: 50,
  },
  spinner: {
    width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)',
    borderTop: '2.5px solid #fff', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', display: 'inline-block',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 16px',
  },
  dividerLine: { flex: 1, height: 1, background: '#E2E8F0' },
  dividerText: { fontSize: 12, color: '#94a3b8', fontFamily: 'system-ui, sans-serif' },
  registerText: {
    textAlign: 'center', fontSize: 14, color: '#64748b',
    fontFamily: 'system-ui, sans-serif', margin: 0,
  },
  registerLink: {
    color: '#4F46E5', fontWeight: 700, textDecoration: 'none',
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }
  input:focus { outline: none; }
  div[style*="border: 1.5px"]:focus-within { border-color: #4F46E5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.12); }`;
  document.head.appendChild(style);
}

export default Login;