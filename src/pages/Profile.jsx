import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ── Style constants (same palette as StudentDashboard) ───────────────────────
const page    = { background: '#EEF4FB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a3a5c' };
const topbar  = { background: '#fff', borderBottom: '1px solid #D0E2F4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 };
const hero    = { background: '#fff', borderBottom: '1px solid #D0E2F4', padding: '18px 24px' };
const content = { padding: 24, maxWidth: 720, margin: '0 auto' };
const navBtn  = { fontSize: 13, padding: '6px 12px', borderRadius: 6, color: '#5a7a9a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' };
const navActive = { ...navBtn, background: '#E6F1FB', color: '#185FA5', fontWeight: 600 };

const card    = { background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: '20px 22px', marginBottom: 16 };
const secLabel = { fontSize: 11, fontWeight: 700, color: '#378ADD', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 };
const fieldLabel = { fontSize: 12, color: '#5a7a9a', width: 130, flexShrink: 0, paddingTop: 1 };
const fieldValue = { fontSize: 13, color: '#1a3a5c' };
const divider = { border: 'none', borderTop: '1px solid #D0E2F4', margin: '14px 0' };

const btnPrimary = { background: '#185FA5', border: '1px solid #185FA5', color: '#fff', fontSize: 13, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' };
const btnOutline = { background: '#fff', border: '1px solid #B5D4F4', color: '#185FA5', fontSize: 13, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' };

// ── Component ─────────────────────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [editing, setEditing]   = useState(false);
  const [profile, setProfile]   = useState({
    university: '',
    degree: '',
    gradYear: '',
    phone: '',
    skills: '',
    bio: '',
  });

  // Load saved profile from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('studentProfile') || '{}');
      setProfile(prev => ({ ...prev, ...saved }));
    } catch (_) {}
  }, []);

  const handleSave = () => {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    setEditing(false);
  };

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    navigate('/login');
  };

  // Stats
  let registeredFairs = [], mySubmissions = [];
  try { registeredFairs = JSON.parse(localStorage.getItem('registeredFairs') || '[]'); } catch (_) {}
  try {
    const all = JSON.parse(localStorage.getItem('submittedResumes') || '{}');
    mySubmissions = Object.entries(all).reduce((acc, [company, data]) => {
      if (user?.email && data?.[user.email]) acc.push({ company, ...data[user.email] });
      return acc;
    }, []);
  } catch (_) {}

  const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase() || '?';

  const Field = ({ label, value, field, type = 'text' }) => (
    <div style={{ display: 'flex', marginBottom: 12, alignItems: editing ? 'center' : 'flex-start' }}>
      <div style={fieldLabel}>{label}</div>
      {editing ? (
        <input
          type={type}
          value={profile[field] || ''}
          onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}`}
          style={{ flex: 1, fontSize: 13, padding: '6px 10px', borderRadius: 7, border: '1px solid #B5D4F4', fontFamily: 'inherit', color: '#1a3a5c', outline: 'none' }}
        />
      ) : (
        <div style={{ ...fieldValue, flex: 1 }}>{value || <span style={{ color: '#aac0d6' }}>—</span>}</div>
      )}
    </div>
  );

  return (
    <div style={page}>

      {/* ── Top bar ── */}
      <div style={topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>VCF</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0C447C' }}>Virtual Career Fair</div>
            <div style={{ fontSize: 11, color: '#5a7a9a' }}>Student Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/student/dashboard" style={navBtn}>Dashboard</Link>
          <Link to="/profile"           style={navActive}>Profile</Link>
          <Link to="/networking"        style={navBtn}>Networking</Link>
          <button onClick={handleLogout} style={{ ...navBtn, color: '#A32D2D', fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={hero}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0C447C', marginBottom: 3 }}>My Profile</div>
        <div style={{ fontSize: 13, color: '#5a7a9a' }}>Your personal information and career details.</div>
      </div>

      {/* ── Content ── */}
      <div style={content}>

        {/* Avatar + name card */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
              {initials(user?.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: '#0C447C', marginBottom: 2 }}>{user?.name || 'Student'}</div>
              <div style={{ fontSize: 12, color: '#5a7a9a' }}>{user?.email || '—'}</div>
              <div style={{ fontSize: 11, color: '#378ADD', marginTop: 2 }}>Student · Virtual Career Fair</div>
            </div>
            {!editing
              ? <button style={btnOutline} onClick={() => setEditing(true)}>Edit profile</button>
              : <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btnOutline} onClick={() => setEditing(false)}>Cancel</button>
                  <button style={btnPrimary} onClick={handleSave}>Save</button>
                </div>
            }
          </div>

          <hr style={divider} />

          <Field label="University"       value={profile.university} field="university" />
          <Field label="Degree"           value={profile.degree}     field="degree"     />
          <Field label="Graduation year"  value={profile.gradYear}   field="gradYear"   type="number" />
          <Field label="Phone"            value={profile.phone}      field="phone"      type="tel" />

          <div style={{ display: 'flex', marginBottom: 12, alignItems: editing ? 'flex-start' : 'flex-start' }}>
            <div style={fieldLabel}>Skills</div>
            {editing ? (
              <input
                value={profile.skills}
                onChange={e => setProfile(p => ({ ...p, skills: e.target.value }))}
                placeholder="e.g. React, Python, SQL (comma separated)"
                style={{ flex: 1, fontSize: 13, padding: '6px 10px', borderRadius: 7, border: '1px solid #B5D4F4', fontFamily: 'inherit', color: '#1a3a5c', outline: 'none' }}
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profile.skills
                  ? profile.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} style={{ background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 20, fontSize: 11, color: '#0C447C', padding: '2px 9px', fontWeight: 600 }}>{s}</span>
                    ))
                  : <span style={{ color: '#aac0d6', fontSize: 13 }}>—</span>
                }
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={fieldLabel}>Bio</div>
            {editing ? (
              <textarea
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="A short bio about yourself..."
                rows={3}
                style={{ flex: 1, fontSize: 13, padding: '6px 10px', borderRadius: 7, border: '1px solid #B5D4F4', fontFamily: 'inherit', color: '#1a3a5c', outline: 'none', resize: 'vertical' }}
              />
            ) : (
              <div style={{ ...fieldValue, flex: 1 }}>{profile.bio || <span style={{ color: '#aac0d6' }}>—</span>}</div>
            )}
          </div>
        </div>

        {/* Activity summary */}
        <div style={card}>
          <div style={secLabel}>Activity Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Fairs Registered',  v: registeredFairs.length },
              { label: 'Resumes Submitted', v: mySubmissions.length },
              { label: 'Shortlisted',       v: mySubmissions.filter(r => r.status === 'Shortlisted').length },
            ].map(s => (
              <div key={s.label} style={{ background: '#F0F6FD', border: '1px solid #D0E2F4', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#185FA5' }}>{s.v}</div>
                <div style={{ fontSize: 11, color: '#5a7a9a', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent submissions on profile */}
        {mySubmissions.length > 0 && (
          <div style={card}>
            <div style={secLabel}>Recent Submissions</div>
            {mySubmissions.slice(0, 3).map(r => (
              <div key={r.company} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EEF4FB' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: '#B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#0C447C' }}>
                    {r.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0C447C' }}>{r.company}</div>
                    <div style={{ fontSize: 11, color: '#5a7a9a' }}>{r.fileName} · {new Date(r.submittedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                  ...(r.status === 'Shortlisted' ? { background: '#EAF3DE', color: '#27500A', border: '1px solid #C0DD97' }
                    : r.status === 'Rejected'    ? { background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1' }
                    :                             { background: '#FAEEDA', color: '#633806', border: '1px solid #FAC775' })
                }}>{r.status}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
