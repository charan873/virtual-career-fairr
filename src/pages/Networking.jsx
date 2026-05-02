import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// ── Style constants (same palette as StudentDashboard) ───────────────────────
const page    = { background: '#EEF4FB', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a3a5c' };
const topbar  = { background: '#fff', borderBottom: '1px solid #D0E2F4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 };
const hero    = { background: '#fff', borderBottom: '1px solid #D0E2F4', padding: '18px 24px' };
const content = { padding: 24, maxWidth: 860, margin: '0 auto' };
const navBtn  = { fontSize: 13, padding: '6px 12px', borderRadius: 6, color: '#5a7a9a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'inline-block' };
const navActive = { ...navBtn, background: '#E6F1FB', color: '#185FA5', fontWeight: 600 };

const secLabel = { fontSize: 11, fontWeight: 700, color: '#378ADD', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 };
const secDesc  = { fontSize: 12, color: '#5a7a9a', marginBottom: 14 };
const emptyBox = { background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 36, textAlign: 'center', marginBottom: 16 };

const personCard = { background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 };
const eventCard  = { background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 };

const btnPrimary = { background: '#185FA5', border: '1px solid #185FA5', color: '#fff', fontSize: 12, padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' };
const btnOutline = { background: '#fff', border: '1px solid #B5D4F4', color: '#185FA5', fontSize: 12, padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', whiteSpace: 'nowrap' };
const backBtn    = { background: '#fff', border: '1px solid #D0E2F4', color: '#5a7a9a', fontSize: 12, padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 5 };

const avatarColors = [
  { background: '#E6F1FB', color: '#0C447C' },
  { background: '#E1F5EE', color: '#085041' },
  { background: '#FAECE7', color: '#712B13' },
  { background: '#EEEDFE', color: '#3C3489' },
  { background: '#FAEEDA', color: '#633806' },
];

const eventIconColors = ['#E6F1FB', '#FAEEDA', '#EAF3DE', '#EEEDFE', '#FAECE7'];

// ── Component ─────────────────────────────────────────────────────────────────
const Networking = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Reads from localStorage — populated by AdminNetworking.jsx
  const [contacts, setContacts] = useState([]);
  const [events, setEvents]     = useState([]);

  useEffect(() => {
    const load = () => {
      try { setContacts(JSON.parse(localStorage.getItem('networkingContacts') || '[]')); } catch (_) {}
      try { setEvents(JSON.parse(localStorage.getItem('networkingEvents')  || '[]')); } catch (_) {}
    };
    load();
    // Re-load if admin updates in another tab
    const onSt = (e) => {
      if (e.key === 'networkingContacts' || e.key === 'networkingEvents') load();
    };
    window.addEventListener('storage', onSt);
    return () => window.removeEventListener('storage', onSt);
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    navigate('/login');
  };

  const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div style={page}>

      {/* Top bar */}
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
          <Link to="/profile"           style={navBtn}>Profile</Link>
          <Link to="/networking"        style={navActive}>Networking</Link>
          <button onClick={handleLogout} style={{ ...navBtn, color: '#A32D2D', fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={hero}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0C447C', marginBottom: 3 }}>
          Networking Opportunities
        </div>
        <div style={{ fontSize: 13, color: '#5a7a9a' }}>
          Connect with companies, join video meetings, and explore career opportunities.
        </div>
      </div>

      {/* Content */}
      <div style={content}>
        <button style={backBtn} onClick={() => navigate('/student/dashboard')}>
          ← Back to Dashboard
        </button>

        {/* Smart Matches */}
        <div style={secLabel}>💡 Smart Matches</div>
        <div style={secDesc}>People you should connect with based on your profile and interests.</div>

        {contacts.length === 0 ? (
          <div style={emptyBox}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a5c', marginBottom: 4 }}>No contacts yet</div>
            <div style={{ fontSize: 12, color: '#5a7a9a' }}>The admin hasn't added any networking contacts yet. Check back soon!</div>
          </div>
        ) : (
          contacts.map((person, i) => (
            <div key={person.id} style={personCard}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, ...avatarColors[i % avatarColors.length] }}>
                {initials(person.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C', marginBottom: 2 }}>{person.name}</div>
                <div style={{ fontSize: 12, color: '#5a7a9a' }}>
                  {person.role}
                  <span style={{ marginLeft: 5, padding: '1px 7px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#E6F1FB', color: '#0C447C', border: '1px solid #B5D4F4' }}>
                    {person.company}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button style={btnOutline}>Chat</button>
                <button style={btnPrimary}>📹 Video</button>
              </div>
            </div>
          ))
        )}

        {/* Today's Schedule */}
        <div style={{ ...secLabel, marginTop: 28 }}>📅 Today's Schedule</div>
        <div style={secDesc}>Upcoming events and networking opportunities.</div>

        {events.length === 0 ? (
          <div style={emptyBox}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3a5c', marginBottom: 4 }}>No events scheduled</div>
            <div style={{ fontSize: 12, color: '#5a7a9a' }}>The admin hasn't added any events yet. Check back soon!</div>
          </div>
        ) : (
          events.map((ev, i) => (
            <div key={ev.id} style={eventCard}>
              <div style={{ width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, background: eventIconColors[i % eventIconColors.length] }}>
                {ev.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C', marginBottom: 2 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: '#378ADD' }}>{ev.time}</div>
                {ev.speaker && <div style={{ fontSize: 11, color: '#5a7a9a', marginTop: 2 }}>{ev.speaker}</div>}
              </div>
              {/* live flag set by admin controls this button */}
              {ev.live
                ? <button style={btnPrimary}>Join</button>
                : <button style={btnOutline}>Remind me</button>
              }
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Networking;
