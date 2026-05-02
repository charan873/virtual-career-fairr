import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const TABS = ['Overview', 'Fair Setup', 'Booths', 'Published Fairs', 'Resume Applications', 'Networking'];

/* ─────────────────────────────────────────────────────────────────────────────
   NETWORKING MANAGER
───────────────────────────────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#EAF3DE', color: '#27500A' },
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#FAEEDA', color: '#633806' },
];

const EVENT_ICONS = ['🎤', '🤝', '🎓', '📋', '💼', '🏆'];
const EVENT_BG = ['#E6F1FB', '#FAEEDA', '#EAF3DE', '#EEEDFE', '#FAECE7'];

const EMPTY_C = { name: '', role: '', company: '' };
const EMPTY_E = { title: '', time: '', speaker: '', icon: '🎤', live: false };
const EMPTY_S = { title: '', type: 'chat', scheduledAt: '', meetLink: '', description: '', active: false };

const nwInit = (n = '') => n.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
const fmtDt = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
};

const NetworkingManager = () => {
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [nwTab, setNwTab] = useState('contacts');
  const [nc, setNc] = useState(EMPTY_C);
  const [ne, setNe] = useState(EMPTY_E);
  const [ns, setNs] = useState(EMPTY_S);
  const [cErr, setCErr] = useState('');
  const [eErr, setEErr] = useState('');
  const [sErr, setSErr] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { setContacts(JSON.parse(localStorage.getItem('nwContacts') || '[]')); } catch (_) {}
    try { setEvents(JSON.parse(localStorage.getItem('nwEvents') || '[]')); } catch (_) {}
    try { setSessions(JSON.parse(localStorage.getItem('nwSessions') || '[]')); } catch (_) {}
  }, []);

  const persist = (c, e, s) => {
    localStorage.setItem('nwContacts', JSON.stringify(c));
    localStorage.setItem('nwEvents', JSON.stringify(e));
    localStorage.setItem('nwSessions', JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addContact = () => {
    if (!nc.name.trim()) { setCErr('Name is required.'); return; }
    if (!nc.role.trim()) { setCErr('Role is required.'); return; }
    if (!nc.company.trim()) { setCErr('Company is required.'); return; }

    setCErr('');
    const updated = [...contacts, { ...nc, id: Date.now() }];
    setContacts(updated);
    persist(updated, events, sessions);
    setNc(EMPTY_C);
  };

  const rmContact = (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    persist(updated, events, sessions);
  };

  const addEvent = () => {
    if (!ne.title.trim()) { setEErr('Title is required.'); return; }
    if (!ne.time.trim()) { setEErr('Time is required.'); return; }

    setEErr('');
    const updated = [...events, { ...ne, id: Date.now() }];
    setEvents(updated);
    persist(contacts, updated, sessions);
    setNe(EMPTY_E);
  };

  const rmEvent = (id) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    persist(contacts, updated, sessions);
  };

  const toggleLive = (id) => {
    const updated = events.map((e) => (e.id === id ? { ...e, live: !e.live } : e));
    setEvents(updated);
    persist(contacts, updated, sessions);
  };

  const addSession = () => {
    if (!ns.title.trim()) { setSErr('Title is required.'); return; }
    if (!ns.scheduledAt.trim()) { setSErr('Date & time is required.'); return; }
    if (ns.type === 'video' && !ns.meetLink.trim()) { setSErr('Meet link is required.'); return; }

    setSErr('');
    const updated = [...sessions, { ...ns, id: Date.now() }];
    setSessions(updated);
    persist(contacts, events, updated);
    setNs(EMPTY_S);
  };

  const rmSession = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    persist(contacts, events, updated);
  };

  const toggleActive = (id) => {
    const updated = sessions.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSessions(updated);
    persist(contacts, events, updated);
  };

  const liveCnt = sessions.filter((s) => s.active).length;

  const subTabs = [
    { key: 'contacts', label: '👥 Smart Matches', count: contacts.length },
    { key: 'events', label: '📅 Schedule', count: events.length },
    { key: 'sessions', label: '🎥 Live Sessions', count: liveCnt, live: liveCnt > 0 },
  ];

  return (
    <div>
      {saved && (
        <div style={{ padding: '9px 16px', background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: 10, fontSize: 13, color: '#27500A', fontWeight: 600, marginBottom: 16 }}>
          ✓ Saved! Students will see these changes immediately.
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #D0E2F4', marginBottom: 20 }}>
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setNwTab(t.key)}
            style={{
              padding: '9px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: nwTab === t.key ? 700 : 500,
              color: nwTab === t.key ? '#185FA5' : '#5a7a9a',
              borderBottom: nwTab === t.key ? '2px solid #185FA5' : '2px solid transparent',
              marginBottom: -2,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {t.label}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, background: t.live ? '#EAF3DE' : '#E6F1FB', color: t.live ? '#27500A' : '#0C447C', border: `1px solid ${t.live ? '#C0DD97' : '#B5D4F4'}` }}>
              {t.live ? `${t.count} LIVE` : t.count}
            </span>
          </button>
        ))}
      </div>

      {nwTab === 'contacts' && (
        <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 22 }}>
          <div style={nwSec}>Smart Matches — Contacts</div>
          <p style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 16, marginTop: -8 }}>
            These contacts appear in the "Smart Matches" section of every student's Networking page.
          </p>

          <div style={nwFBox}>
            <div style={nwFTitle}>Add a new contact</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[
                ['name', 'Full name *', 'e.g. John Smith'],
                ['role', 'Role / Title *', 'e.g. HR Manager'],
                ['company', 'Company *', 'e.g. TCS'],
              ].map(([k, l, p]) => (
                <div key={k}>
                  <div style={fieldLabel}>{l}</div>
                  <input
                    style={fieldInput}
                    value={nc[k]}
                    onChange={(e) => setNc((prev) => ({ ...prev, [k]: e.target.value }))}
                    placeholder={p}
                  />
                </div>
              ))}
            </div>

            {cErr && <div style={nwErr}>{cErr}</div>}
            <button style={btnPrimary} onClick={addContact}>+ Add Contact</button>
          </div>

          {contacts.length === 0 ? (
            <div style={nwMt}>No contacts yet. Add one above.</div>
          ) : (
            contacts.map((c, i) => (
              <div key={c.id} style={nwRow}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, background: AVATAR_COLORS[i % AVATAR_COLORS.length].bg, color: AVATAR_COLORS[i % AVATAR_COLORS.length].color }}>
                  {nwInit(c.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#5a7a9a' }}>
                    {c.role}
                    <span style={{ marginLeft: 4, padding: '1px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#E6F1FB', color: '#0C447C', border: '1px solid #B5D4F4' }}>
                      {c.company}
                    </span>
                  </div>
                </div>
                <button style={btnDng} onClick={() => rmContact(c.id)}>Remove</button>
              </div>
            ))
          )}
        </div>
      )}

      {nwTab === 'events' && (
        <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 22 }}>
          <div style={nwSec}>Today's Schedule — Events</div>
          <p style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 16, marginTop: -8 }}>
            Appear in "Today's Schedule". Toggle Live to show a Join button to students.
          </p>

          <div style={nwFBox}>
            <div style={nwFTitle}>Add a new event</div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={fieldLabel}>Event title *</div>
                <input style={fieldInput} value={ne.title} onChange={(e) => setNe((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Keynote Session" />
              </div>
              <div>
                <div style={fieldLabel}>Time *</div>
                <input style={fieldInput} value={ne.time} onChange={(e) => setNe((p) => ({ ...p, time: e.target.value }))} placeholder="e.g. 10:00 AM – 11:00 AM" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={fieldLabel}>Speaker / description</div>
                <input style={fieldInput} value={ne.speaker} onChange={(e) => setNe((p) => ({ ...p, speaker: e.target.value }))} placeholder="e.g. Speaker: John Doe" />
              </div>
              <div>
                <div style={fieldLabel}>Icon</div>
                <select style={fieldInput} value={ne.icon} onChange={(e) => setNe((p) => ({ ...p, icon: e.target.value }))}>
                  {EVENT_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5a7a9a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={ne.live} onChange={(e) => setNe((p) => ({ ...p, live: e.target.checked }))} />
                  Live now
                </label>
              </div>
            </div>

            {eErr && <div style={nwErr}>{eErr}</div>}
            <button style={btnPrimary} onClick={addEvent}>+ Add Event</button>
          </div>

          {events.length === 0 ? (
            <div style={nwMt}>No events yet. Add one above.</div>
          ) : (
            events.map((ev, i) => (
              <div key={ev.id} style={{ ...nwRow, background: ev.live ? '#F0FBF0' : '#F8FBFF', borderColor: ev.live ? '#C0DD97' : '#D0E2F4' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, background: EVENT_BG[i % EVENT_BG.length], flexShrink: 0 }}>
                  {ev.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: '#378ADD' }}>{ev.time}</div>
                  {ev.speaker && <div style={{ fontSize: 11, color: '#5a7a9a' }}>{ev.speaker}</div>}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: ev.live ? '#27500A' : '#5a7a9a', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={ev.live} onChange={() => toggleLive(ev.id)} />
                  {ev.live ? '🟢 Live' : 'Upcoming'}
                </label>
                <button style={btnDng} onClick={() => rmEvent(ev.id)}>Remove</button>
              </div>
            ))
          )}
        </div>
      )}

      {nwTab === 'sessions' && (
        <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 22 }}>
          <div style={nwSec}>Live Sessions — Chat &amp; Video Meet</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            {[
              { icon: '💬', t: 'Live Chat', d: 'Real-time text chat room for all students. Great for Q&A.' },
              { icon: '🎥', t: 'Video Meet', d: 'Paste a Google Meet / Zoom link. Students get a Join button when live.' },
            ].map((b) => (
              <div key={b.t} style={{ background: '#F0F6FD', border: '1px solid #D0E2F4', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0C447C', marginBottom: 3 }}>{b.icon} {b.t}</div>
                <div style={{ fontSize: 12, color: '#5a7a9a' }}>{b.d}</div>
              </div>
            ))}
          </div>

          <div style={nwFBox}>
            <div style={nwFTitle}>Schedule a new session</div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={fieldLabel}>Session title *</div>
                <input style={fieldInput} value={ns.title} onChange={(e) => setNs((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. TCS HR Q&A" />
              </div>
              <div>
                <div style={fieldLabel}>Session type *</div>
                <select style={fieldInput} value={ns.type} onChange={(e) => setNs((p) => ({ ...p, type: e.target.value }))}>
                  <option value="chat">💬 Live Chat</option>
                  <option value="video">🎥 Video Meet</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <div style={fieldLabel}>Scheduled date &amp; time *</div>
                <input type="datetime-local" style={fieldInput} value={ns.scheduledAt} onChange={(e) => setNs((p) => ({ ...p, scheduledAt: e.target.value }))} />
              </div>
              <div>
                {ns.type === 'video' ? (
                  <>
                    <div style={fieldLabel}>Meet link *</div>
                    <input style={fieldInput} value={ns.meetLink} onChange={(e) => setNs((p) => ({ ...p, meetLink: e.target.value }))} placeholder="https://meet.google.com/..." />
                  </>
                ) : (
                  <>
                    <div style={fieldLabel}>Description (optional)</div>
                    <input style={fieldInput} value={ns.description} onChange={(e) => setNs((p) => ({ ...p, description: e.target.value }))} placeholder="e.g. Ask anything about placements" />
                  </>
                )}
              </div>
            </div>

            {sErr && <div style={nwErr}>{sErr}</div>}
            <button style={btnPrimary} onClick={addSession}>+ Schedule Session</button>
          </div>

          {sessions.length === 0 ? (
            <div style={nwMt}>No sessions scheduled yet.</div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} style={{ ...nwRow, flexDirection: 'column', alignItems: 'stretch', padding: 16, background: s.active ? '#F0FBF0' : '#F8FBFF', borderColor: s.active ? '#C0DD97' : '#D0E2F4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 20, width: 38, height: 38, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.type === 'video' ? '#EEEDFE' : '#E6F1FB', flexShrink: 0 }}>
                    {s.type === 'video' ? '🎥' : '💬'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{s.title}</span>
                      {s.active && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: '#EAF3DE', color: '#27500A', border: '1px solid #C0DD97', padding: '1px 8px', borderRadius: 20 }}>
                          🟢 LIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#5a7a9a' }}>📅 {fmtDt(s.scheduledAt)}</div>
                    {s.meetLink && <div style={{ fontSize: 11, color: '#378ADD', marginTop: 2 }}>🔗 {s.meetLink}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      style={s.active ? { ...btnDng, background: '#fff' } : { ...btnPrimary, background: '#27500A', borderColor: '#27500A' }}
                      onClick={() => toggleActive(s.id)}
                    >
                      {s.active ? '⏹ Stop' : '▶ Go Live'}
                    </button>
                    <button style={btnDng} onClick={() => rmSession(s.id)}>Remove</button>
                  </div>
                </div>

                {s.active && (
                  <div style={{ marginTop: 12, padding: '9px 14px', background: '#fff', border: '1px dashed #C0DD97', borderRadius: 8, fontSize: 12, color: '#27500A' }}>
                    <strong>Students see:</strong> {s.type === 'video' ? `"Join Video Meet" → ${s.meetLink}` : '"Join Live Chat" button'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('Overview');
  const [fairData, setFairData] = useState({ title: '', date: '' });
  const [boothData, setBoothData] = useState({
    companyName: '',
    description: '',
    hiringRoles: '',
    eligibilityCriteria: '',
  });

  const [submittedResumes, setSubmittedResumes] = useState([]);
  const [availableFairs, setAvailableFairs] = useState([]);
  const [currentStep, setCurrentStep] = useState('create');
  const [currentFair, setCurrentFair] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setResumeLoading(true);
        const resumeResponse = await fetch('http://localhost:8082/api/resumes/all');
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          setSubmittedResumes(Array.isArray(resumeData) ? resumeData : []);
        } else {
          setSubmittedResumes([]);
        }
      } catch (err) {
        console.error('Error loading resumes:', err);
        setSubmittedResumes([]);
      } finally {
        setResumeLoading(false);
      }

      try {
        setAvailableFairs(JSON.parse(localStorage.getItem('createdFairs') || '[]'));
      } catch (err) {
        console.error(err);
      }
    };

    loadData();

    const handleStorage = (e) => {
      if (e.key === 'createdFairs') {
        try {
          setAvailableFairs(JSON.parse(localStorage.getItem('createdFairs') || '[]'));
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(loadData, 3000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateFair = (e) => {
    e.preventDefault();
    if (!fairData.title || !fairData.date) {
      alert('Please fill in all fields');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('createdFairs') || '[]');
    const newFair = {
      id: Date.now(),
      name: fairData.title,
      date: fairData.date,
      description: 'Career fair created by admin',
      participatingCompanies: [],
      image: '/images/default-fair.jpg',
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newFair];
    localStorage.setItem('createdFairs', JSON.stringify(updated));
    setCurrentFair(newFair);
    setAvailableFairs(updated);
    setCurrentStep('booth');
    setFairData({ title: '', date: '' });
    setActiveTab('Booths');
  };

  const handleAddBooth = (e) => {
    e.preventDefault();

    if (!boothData.companyName) {
      alert('Please enter a company name');
      return;
    }

    if (!currentFair) {
      alert('Please create a fair first');
      return;
    }

    if (currentFair.participatingCompanies.includes(boothData.companyName)) {
      alert('Company already added');
      return;
    }

    const updatedFair = {
      ...currentFair,
      participatingCompanies: [...currentFair.participatingCompanies, boothData.companyName],
    };

    setCurrentFair(updatedFair);

    const existing = JSON.parse(localStorage.getItem('createdFairs') || '[]');
    const idx = existing.findIndex((f) => f.id === currentFair.id);
    if (idx !== -1) {
      existing[idx] = updatedFair;
      localStorage.setItem('createdFairs', JSON.stringify(existing));
      setAvailableFairs(existing);
    }

    setBoothData({
      companyName: '',
      description: '',
      hiringRoles: '',
      eligibilityCriteria: '',
    });
  };

  const handlePublishFair = () => {
    if (!currentFair || currentFair.participatingCompanies.length === 0) {
      alert('Add at least one company first');
      return;
    }

    const updatedFair = {
      ...currentFair,
      status: 'published',
      submittedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('createdFairs') || '[]');
    const idx = existing.findIndex((f) => f.id === currentFair.id);

    if (idx !== -1) {
      existing[idx] = updatedFair;
      localStorage.setItem('createdFairs', JSON.stringify(existing));
      setAvailableFairs(existing);
    }

    setCurrentFair(null);
    setCurrentStep('create');
    setActiveTab('Published Fairs');
  };

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
    setShowResumeModal(true);
  };

  const handleOpenResume = (id) => {
    window.open(`http://localhost:8082/api/resumes/download/${id}`, '_blank');
  };

  const handleStatusChange = async (resumeId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8082/api/resumes/status/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedResume = await response.json();

      const updated = submittedResumes.map((resume) =>
        resume.id === resumeId ? updatedResume : resume
      );

      setSubmittedResumes(updated);

      if (selectedResume?.id === resumeId) {
        setSelectedResume(updatedResume);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const publishedFairs = availableFairs.filter((f) => f.status === 'published');
  const totalSubmissions = submittedResumes.length;

  const statusStyle = (status) => {
    if (status === 'Shortlisted') return { background: '#EAF3DE', color: '#27500A', border: '1px solid #C0DD97' };
    if (status === 'Rejected') return { background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1' };
    return { background: '#FAEEDA', color: '#633806', border: '1px solid #FAC775' };
  };

  return (
    <div style={{ background: '#EEF4FB', minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #D0E2F4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#E6F1FB', border: '1px solid #B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#185FA5" strokeWidth="1.5" />
              <circle cx="9" cy="7" r="2.5" stroke="#185FA5" strokeWidth="1.5" />
              <path d="M4 15c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0C447C' }}>Virtual Career Fair</div>
            <div style={{ fontSize: 11, color: '#5a7a9a' }}>Admin Control Panel</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{ fontSize: 13, padding: '6px 16px', borderRadius: 7, border: '1px solid #D0E2F4', background: '#fff', color: '#A32D2D', cursor: 'pointer', fontWeight: 600 }}
        >
          Logout
        </button>
      </div>

      <div style={{ background: '#fff', borderBottom: '2px solid #D0E2F4', padding: '0 24px', display: 'flex', gap: 0 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontSize: 13,
              padding: '11px 18px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#185FA5' : '#5a7a9a',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #185FA5' : '2px solid transparent',
              marginBottom: -2,
              fontFamily: 'inherit',
              transition: 'color .15s',
            }}
          >
            {tab}
            {tab === 'Resume Applications' && totalSubmissions > 0 && (
              <span style={{ marginLeft: 6, background: '#185FA5', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>
                {totalSubmissions}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
        {activeTab === 'Overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Total Fairs', value: availableFairs.length },
                { label: 'Published Fairs', value: publishedFairs.length },
                { label: 'Resume Submissions', value: totalSubmissions },
                { label: 'Companies', value: [...new Set(availableFairs.flatMap((f) => f.participatingCompanies || []))].length },
              ].map((s) => (
                <div key={s.label} style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#185FA5' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#378ADD', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('Fair Setup')} style={btnPrimary}>+ Create New Fair</button>
                <button onClick={() => setActiveTab('Booths')} style={btnOutline}>Manage Booths</button>
                <button onClick={() => setActiveTab('Resume Applications')} style={btnOutline}>View Applications</button>
                <button onClick={() => setActiveTab('Networking')} style={btnOutline}>🤝 Networking</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Fair Setup' && (
          <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              {['Create', 'Add Booths', 'Publish'].map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        background: i === 0 ? '#E6F1FB' : '#F5F9FE',
                        border: i === 0 ? '1.5px solid #185FA5' : '1px solid #B5D4F4',
                        color: i === 0 ? '#185FA5' : '#5a7a9a',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 10, color: '#5a7a9a', marginTop: 3 }}>{s}</div>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: '#D0E2F4', margin: '0 8px', marginBottom: 14 }} />}
                </React.Fragment>
              ))}
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C', marginBottom: 4 }}>Create Career Fair</div>
            <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 20 }}>Set up a new career fair event</div>

            <form onSubmit={handleCreateFair}>
              <div style={{ marginBottom: 14 }}>
                <div style={fieldLabel}>Fair Title</div>
                <input
                  style={fieldInput}
                  type="text"
                  placeholder="e.g. Tech Career Fair 2026"
                  value={fairData.title}
                  onChange={(e) => setFairData({ ...fairData, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={fieldLabel}>Fair Date</div>
                <input
                  style={fieldInput}
                  type="date"
                  value={fairData.date}
                  onChange={(e) => setFairData({ ...fairData, date: e.target.value })}
                  required
                />
              </div>

              <button type="submit" style={{ ...btnPrimary, width: '100%', padding: '10px 0', fontSize: 14 }}>
                Create Fair →
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Booths' && (
          <div>
            {!currentFair ? (
              <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Active Fair Setup</div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 16, marginTop: 4 }}>
                  Create a fair first before adding booths
                </div>
                <button style={btnPrimary} onClick={() => setActiveTab('Fair Setup')}>Go to Fair Setup</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>
                <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C', marginBottom: 4 }}>Add Booth / Company</div>
                  <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 20 }}>
                    Add participating companies to {currentFair.name}
                  </div>

                  <form onSubmit={handleAddBooth}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={fieldLabel}>Company Name</div>
                      <input
                        style={fieldInput}
                        type="text"
                        placeholder="e.g. TCS"
                        value={boothData.companyName}
                        onChange={(e) => setBoothData({ ...boothData, companyName: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={fieldLabel}>Description</div>
                      <textarea
                        style={{ ...fieldInput, minHeight: 78, resize: 'vertical' }}
                        placeholder="Company booth description"
                        value={boothData.description}
                        onChange={(e) => setBoothData({ ...boothData, description: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={fieldLabel}>Hiring Roles</div>
                      <input
                        style={fieldInput}
                        type="text"
                        placeholder="e.g. Software Engineer, Analyst"
                        value={boothData.hiringRoles}
                        onChange={(e) => setBoothData({ ...boothData, hiringRoles: e.target.value })}
                      />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={fieldLabel}>Eligibility Criteria</div>
                      <input
                        style={fieldInput}
                        type="text"
                        placeholder="e.g. B.Tech CSE, 2026 passout"
                        value={boothData.eligibilityCriteria}
                        onChange={(e) => setBoothData({ ...boothData, eligibilityCriteria: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" style={btnPrimary}>+ Add Booth</button>
                      <button type="button" style={btnOutline} onClick={handlePublishFair}>Publish Fair</button>
                    </div>
                  </form>
                </div>

                <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C', marginBottom: 4 }}>Current Booths</div>
                  <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 20 }}>
                    Participating companies for this fair
                  </div>

                  {currentFair.participatingCompanies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#5a7a9a', fontSize: 13 }}>
                      No companies added yet
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {currentFair.participatingCompanies.map((company, i) => (
                        <div key={company} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: AVATAR_COLORS[i % AVATAR_COLORS.length].bg, color: AVATAR_COLORS[i % AVATAR_COLORS.length].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                            {company.slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{company}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Published Fairs' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C', marginBottom: 3 }}>Published Career Fairs</div>
              <div style={{ fontSize: 12, color: '#5a7a9a' }}>Live fairs visible to students.</div>
            </div>

            {publishedFairs.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📢</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No published fairs yet</div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 4 }}>Create and publish a fair to make it visible to students.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {publishedFairs.map((fair) => (
                  <div key={fair.id} style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C' }}>{fair.name}</div>
                      <span style={{ background: '#EAF3DE', color: '#27500A', border: '1px solid #C0DD97', borderRadius: 20, fontSize: 11, padding: '2px 9px', fontWeight: 700 }}>
                        Published
                      </span>
                    </div>

                    <div style={{ fontSize: 12, color: '#378ADD', marginBottom: 8 }}>{fair.date}</div>
                    <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 12 }}>{fair.description}</div>

                    {(fair.participatingCompanies || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {fair.participatingCompanies.map((co) => (
                          <span key={co} style={{ background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 6, fontSize: 11, color: '#0C447C', padding: '2px 8px', fontWeight: 500 }}>
                            {co}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Resume Applications' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#378ADD', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
                Resume Applications
              </div>
              <div style={{ fontSize: 13, color: '#5a7a9a' }}>
                Manage student submissions and review uploaded resumes.
              </div>
            </div>

            {resumeLoading ? (
              <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>Loading resumes...</div>
              </div>
            ) : submittedResumes.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No resumes submitted yet</div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 4 }}>
                  Students will submit resumes through their dashboard
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {submittedResumes.map((resume) => (
                  <div key={resume.id} style={{ background: '#fff', border: '1px solid #D0E2F4', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ background: '#F0F6FD', borderBottom: '1px solid #D0E2F4', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: '#B5D4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#0C447C' }}>
                        {(resume.company || 'CO').slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0C447C' }}>{resume.company}</div>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#5a7a9a' }}>{resume.fairName}</span>
                    </div>

                    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EEF4FB', gap: 12 }}>
                      <div>
                        <button
                          onClick={() => handleViewResume(resume)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, fontWeight: 600, color: '#185FA5', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="2" y="1" width="9" height="12" rx="1.5" stroke="#378ADD" strokeWidth="1.2" />
                            <path d="M5 5h4M5 7.5h4M5 10h2" stroke="#378ADD" strokeWidth="1" strokeLinecap="round" />
                          </svg>
                          {resume.fileName}
                        </button>

                        <div style={{ fontSize: 11, color: '#5a7a9a', marginTop: 3 }}>
                          {resume.studentName} · {resume.studentEmail}
                        </div>

                        <div style={{ fontSize: 11, color: '#5a7a9a', marginTop: 3 }}>
                          Submitted: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleString() : '-'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button onClick={() => handleOpenResume(resume.id)} style={btnOutline}>
                          Open Resume
                        </button>

                        <select
                          value={resume.status || 'Pending'}
                          onChange={(e) => handleStatusChange(resume.id, e.target.value)}
                          style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, ...statusStyle(resume.status || 'Pending') }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Networking' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C', marginBottom: 3 }}>Networking Manager</div>
              <div style={{ fontSize: 12, color: '#5a7a9a' }}>
                Manage smart-match contacts, schedule events, and live chat / video sessions visible to all students.
              </div>
            </div>
            <NetworkingManager />
          </div>
        )}
      </div>

      {showResumeModal && selectedResume && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid #D0E2F4', overflow: 'hidden' }}>
            <div style={{ background: '#185FA5', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Resume Details</div>
              <button
                onClick={() => setShowResumeModal(false)}
                style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: 18 }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div style={{ background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginBottom: 4 }}>Student Name</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{selectedResume.studentName}</div>
                </div>

                <div style={{ background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginBottom: 4 }}>Student Email</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{selectedResume.studentEmail}</div>
                </div>

                <div style={{ background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginBottom: 4 }}>Fair</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{selectedResume.fairName}</div>
                </div>

                <div style={{ background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginBottom: 4 }}>Company</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{selectedResume.company}</div>
                </div>

                <div style={{ background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginBottom: 4 }}>File Name</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{selectedResume.fileName}</div>
                </div>

                <div style={{ background: '#F8FBFF', border: '1px solid #D0E2F4', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginBottom: 4 }}>Uploaded At</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>
                    {selectedResume.uploadedAt ? new Date(selectedResume.uploadedAt).toLocaleString() : '-'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 700, ...statusStyle(selectedResume.status || 'Pending') }}>
                  {selectedResume.status || 'Pending'}
                </span>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleOpenResume(selectedResume.id)} style={btnPrimary}>
                    Open Resume
                  </button>
                  <button onClick={() => setShowResumeModal(false)} style={btnOutline}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const btnPrimary = {
  background: '#185FA5',
  border: '1px solid #185FA5',
  color: '#fff',
  fontSize: 13,
  padding: '8px 18px',
  borderRadius: 7,
  cursor: 'pointer',
  fontWeight: 600,
  fontFamily: 'inherit',
};

const btnOutline = {
  background: '#fff',
  border: '1px solid #B5D4F4',
  color: '#185FA5',
  fontSize: 13,
  padding: '8px 18px',
  borderRadius: 7,
  cursor: 'pointer',
  fontWeight: 500,
  fontFamily: 'inherit',
};

const btnDng = {
  background: '#fff',
  border: '1px solid #F7C1C1',
  color: '#A32D2D',
  fontSize: 12,
  padding: '5px 12px',
  borderRadius: 7,
  cursor: 'pointer',
  fontWeight: 500,
  fontFamily: 'inherit',
};

const fieldLabel = {
  fontSize: 12,
  color: '#5a7a9a',
  marginBottom: 6,
};

const fieldInput = {
  width: '100%',
  border: '1px solid #D0E2F4',
  background: '#fff',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 13,
  color: '#1a3a5c',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const nwSec = {
  fontSize: 11,
  fontWeight: 700,
  color: '#378ADD',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  marginBottom: 12,
};

const nwFBox = {
  background: '#F0F6FD',
  border: '1px solid #D0E2F4',
  borderRadius: 10,
  padding: 16,
  marginBottom: 16,
};

const nwFTitle = {
  fontSize: 12,
  fontWeight: 700,
  color: '#185FA5',
  marginBottom: 12,
};

const nwErr = {
  fontSize: 12,
  color: '#A32D2D',
  marginBottom: 8,
};

const nwRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '11px 14px',
  background: '#F8FBFF',
  border: '1px solid #D0E2F4',
  borderRadius: 10,
  marginBottom: 8,
};

const nwMt = {
  textAlign: 'center',
  padding: '28px 0',
  fontSize: 13,
  color: '#5a7a9a',
};

export default AdminDashboard;