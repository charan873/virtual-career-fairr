import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as authRegister } from '../services/authService';

const Register = () => {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authRegister({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      });

      setSuccessMessage(response.message || 'Registration successful');

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', icon: '👤', placeholder: 'Your full name' },
    { key: 'email', label: 'Email address', type: 'email', icon: '✉️', placeholder: 'you@example.com' },
    { key: 'password', label: 'Password', type: showPass ? 'text' : 'password', icon: '🔒', placeholder: 'Min. 6 characters', eye: true },
    { key: 'confirm', label: 'Confirm password', type: showPass ? 'text' : 'password', icon: '🔑', placeholder: 'Re-enter your password' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🎓</div>
          <span style={styles.brandName}>CareerFair</span>
        </div>

        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Join thousands of students and companies</p>

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

        <form onSubmit={handleRegister} style={styles.form}>
          {fields.map(f => (
            <div key={f.key} style={styles.fieldWrap}>
              <label style={styles.label}>{f.label}</label>
              <div
                style={{
                  ...styles.inputWrap,
                  ...(errors[f.key] ? { borderColor: '#EF4444', background: '#FFF5F5' } : {}),
                }}
              >
                <span style={styles.inputIcon}>{f.icon}</span>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={set(f.key)}
                  placeholder={f.placeholder}
                  style={styles.input}
                />
                {f.eye && (
                  <button type="button" onClick={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                )}
              </div>
              {errors[f.key] && <span style={styles.errorMsg}>⚠ {errors[f.key]}</span>}
            </div>
          ))}

          {form.password && (
            <div style={styles.strengthWrap}>
              {['Weak', 'Fair', 'Good', 'Strong'].map((s, i) => {
                const len = form.password.length;
                const filled = len < 6 ? 0 : len < 8 ? 1 : len < 10 ? 2 : len < 12 ? 3 : 4;
                const colors = ['#EF4444', '#F59E0B', '#10B981', '#4F46E5'];
                return (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 4,
                      background: i < filled ? colors[Math.max(filled - 1, 0)] : '#E2E8F0',
                      transition: 'background 0.3s',
                    }}
                  />
                );
              })}
            </div>
          )}

          {serverError && <div style={styles.errorBox}>{serverError}</div>}
          {successMessage && <div style={styles.successBox}>{successMessage}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading
              ? <span style={styles.spinner} />
              : <>Create {role === 'admin' ? 'Admin' : 'Student'} account →</>
            }
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>already registered?</span>
          <span style={styles.dividerLine} />
        </div>

        <p style={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>Sign in here</Link>
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
    fontFamily: "'Georgia', serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '24px 20px',
  },
  blob1: {
    position: 'fixed', top: -100, right: -60, width: 380, height: 380,
    borderRadius: '50%', background: 'radial-gradient(circle, #C7D7FF 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', bottom: -80, left: -40, width: 340, height: 340,
    borderRadius: '50%', background: 'radial-gradient(circle, #D4F1E4 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob3: {
    position: 'fixed', top: '40%', left: '30%', width: 280, height: 280,
    borderRadius: '50%', background: 'radial-gradient(circle, #FDE8FF 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#ffffff',
    borderRadius: 24,
    padding: '44px 44px',
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(99,102,241,0.10)',
    border: '1px solid #E8ECFF',
    position: 'relative',
    zIndex: 1,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    justifyContent: 'center', marginBottom: 24,
  },
  brandIcon: { fontSize: 28 },
  brandName: {
    fontSize: 20, fontWeight: 700, color: '#1e293b',
    fontFamily: "'Georgia', serif", letterSpacing: '-0.3px',
  },
  title: {
    fontSize: 28, fontWeight: 700, color: '#0f172a',
    margin: '0 0 6px', textAlign: 'center', letterSpacing: '-0.5px',
    fontFamily: "'Georgia', serif",
  },
  subtitle: {
    fontSize: 14, color: '#64748b', textAlign: 'center',
    margin: '0 0 24px', fontFamily: 'system-ui, sans-serif',
  },
  toggleWrap: {
    display: 'flex', background: '#F1F5F9', borderRadius: 12,
    padding: 4, marginBottom: 24, gap: 4,
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
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: {
    fontSize: 13, fontWeight: 600, color: '#374151',
    fontFamily: 'system-ui, sans-serif',
  },
  inputWrap: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #E2E8F0', borderRadius: 11,
    overflow: 'hidden', background: '#FAFBFF',
  },
  inputIcon: {
    padding: '0 12px', fontSize: 15, userSelect: 'none',
    borderRight: '1px solid #E2E8F0', background: '#F8FAFF',
    minHeight: 44, display: 'flex', alignItems: 'center',
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
  errorMsg: { fontSize: 12, color: '#EF4444', fontFamily: 'system-ui, sans-serif' },
  strengthWrap: { display: 'flex', gap: 4, marginTop: -8 },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#B91C1C',
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: 13,
    fontFamily: 'system-ui, sans-serif',
  },
  successBox: {
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    color: '#065F46',
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: 13,
    fontFamily: 'system-ui, sans-serif',
  },
  submitBtn: {
    marginTop: 4, padding: '14px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
    minHeight: 50,
  },
  spinner: {
    width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)',
    borderTop: '2.5px solid #fff', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', display: 'inline-block',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 14px',
  },
  dividerLine: { flex: 1, height: 1, background: '#E2E8F0' },
  dividerText: { fontSize: 12, color: '#94a3b8', fontFamily: 'system-ui, sans-serif' },
  loginText: {
    textAlign: 'center', fontSize: 14, color: '#64748b',
    fontFamily: 'system-ui, sans-serif', margin: 0,
  },
  loginLink: { color: '#4F46E5', fontWeight: 700, textDecoration: 'none' },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }
  div[style*="border: 1.5px"]:focus-within { border-color: #4F46E5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important; }`;
  document.head.appendChild(style);
}

export default Register;