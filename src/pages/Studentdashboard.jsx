import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ResumeUpload from '../components/common/ResumeUpload';

let ChatPanel = null;
try { ChatPanel = require('../components/networking/ChatPanel').default; } catch (e) {}

const TABS = ['Home', 'Career Fairs', 'Submit Resume', 'Networking'];

const page = {
  background: '#EEF4FB',
  minHeight: '100vh',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  color: '#1a3a5c',
};

const topbar = {
  background: '#fff',
  borderBottom: '1px solid #D0E2F4',
  padding: '0 24px',
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const hero = {
  background: '#fff',
  borderBottom: '1px solid #D0E2F4',
  padding: '18px 24px',
};

const tabBar = {
  background: '#fff',
  borderBottom: '2px solid #D0E2F4',
  padding: '0 24px',
  display: 'flex',
};

const content = {
  padding: 24,
  maxWidth: 1100,
  margin: '0 auto',
};

const secLabel = {
  fontSize: 11,
  fontWeight: 700,
  color: '#378ADD',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  marginBottom: 10,
};

const card = {
  background: '#fff',
  border: '1px solid #D0E2F4',
  borderRadius: 12,
  padding: '18px 20px',
};

const emptyBox = {
  background: '#fff',
  border: '1px solid #D0E2F4',
  borderRadius: 12,
  padding: 48,
  textAlign: 'center',
};

const btnP = {
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

const btnO = {
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

const navBtn = {
  fontSize: 13,
  padding: '6px 12px',
  borderRadius: 6,
  color: '#5a7a9a',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  textDecoration: 'none',
  display: 'inline-block',
};

const navActive = {
  ...navBtn,
  background: '#E6F1FB',
  color: '#185FA5',
  fontWeight: 600,
};

const regBadge = {
  background: '#EAF3DE',
  color: '#27500A',
  border: '1px solid #C0DD97',
  fontSize: 11,
  padding: '2px 9px',
  borderRadius: 20,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  marginLeft: 8,
};

const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#378ADD" strokeWidth="1.2" />
    <path d="M4 1v2M8 1v2M1 5h10" stroke="#378ADD" strokeWidth="1.2" />
  </svg>
);

const NetworkingTab = ({ user, openChat }) => {
  const [contacts, setContacts] = useState([]);
  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState({});
  const [connectedIds, setConnectedIds] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputMsg, setInputMsg] = useState('');
  const [activeSection, setActiveSection] = useState('contacts');

  const connKey = 'nwConnected_' + (user?.email || 'guest');

  useEffect(() => {
    const load = () => {
      try { setContacts(JSON.parse(localStorage.getItem('nwContacts') || '[]')); } catch (_) {}
      try { setEvents(JSON.parse(localStorage.getItem('nwEvents') || '[]')); } catch (_) {}
      try { setSessions(JSON.parse(localStorage.getItem('nwSessions') || '[]')); } catch (_) {}
      try { setMessages(JSON.parse(localStorage.getItem('nwMessages') || '{}')); } catch (_) {}
      try { setConnectedIds(JSON.parse(localStorage.getItem(connKey) || '[]')); } catch (_) {}
    };

    load();

    const onSt = (e) => {
      if (['nwContacts', 'nwEvents', 'nwSessions', 'nwMessages', connKey].includes(e.key)) {
        load();
      }
    };

    window.addEventListener('storage', onSt);
    const id = setInterval(load, 2000);

    return () => {
      window.removeEventListener('storage', onSt);
      clearInterval(id);
    };
  }, [connKey]);

  const handleConnect = (contactId) => {
    if (connectedIds.includes(contactId)) {
      setActiveChatId(contactId);
      return;
    }

    const updated = [...connectedIds, contactId];
    setConnectedIds(updated);
    localStorage.setItem(connKey, JSON.stringify(updated));
    setActiveChatId(contactId);
  };

  const sendMessage = () => {
    if (!inputMsg.trim() || !activeChatId) return;

    const key = `contact_${activeChatId}`;
    const newMsg = {
      id: Date.now(),
      from: user?.email || 'student',
      fromName: user?.name || 'You',
      text: inputMsg.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = { ...messages, [key]: [...(messages[key] || []), newMsg] };
    setMessages(updated);
    localStorage.setItem('nwMessages', JSON.stringify(updated));
    setInputMsg('');
  };

  const myConnected = contacts.filter((c) => connectedIds.includes(c.id));
  const activeContact = contacts.find((c) => c.id === activeChatId);
  const chatKey = activeChatId ? `contact_${activeChatId}` : null;
  const chatMsgs = chatKey ? (messages[chatKey] || []) : [];
  const liveCount = sessions.filter((s) => s.active).length;

  const subNav = [
    { key: 'contacts', label: '👥 Smart Matches', count: contacts.length, live: false },
    { key: 'schedule', label: "📅 Today's Schedule", count: events.length, live: false },
    { key: 'sessions', label: '🎥 Live Sessions', count: liveCount, live: liveCount > 0 },
  ];

  const subBtnStyle = (key) => ({
    padding: '9px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: activeSection === key ? 700 : 500,
    color: activeSection === key ? '#185FA5' : '#5a7a9a',
    borderBottom: activeSection === key ? '2px solid #185FA5' : '2px solid transparent',
    marginBottom: -2,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  });

  return (
    <div>
      <div style={secLabel}>Networking</div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #D0E2F4', marginBottom: 20 }}>
        {subNav.map((s) => (
          <button key={s.key} style={subBtnStyle(s.key)} onClick={() => setActiveSection(s.key)}>
            {s.label}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: 20,
                background: s.live ? '#EAF3DE' : '#E6F1FB',
                color: s.live ? '#27500A' : '#0C447C',
                border: `1px solid ${s.live ? '#C0DD97' : '#B5D4F4'}`,
              }}
            >
              {s.live ? `${s.count} LIVE` : s.count}
            </span>
          </button>
        ))}
      </div>

      {activeSection === 'contacts' && (
        <div>
          {contacts.length === 0 ? (
            <div style={emptyBox}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Contacts Yet</div>
              <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 4 }}>
                Admin hasn&apos;t added any smart-match contacts yet.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: myConnected.length > 0 ? '1fr 370px' : '1fr', gap: 20, alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 12 }}>
                  Connect with recruiters and professionals to start a conversation.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
                  {contacts.map((c, i) => {
                    const connected = connectedIds.includes(c.id);
                    const initials = (c.name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

                    return (
                      <div key={c.id} style={{ ...card, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: ['#B5D4F4', '#C0DD97', '#FAC775', '#F7C1C1', '#D4B5F4'][i % 5],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 14,
                              fontWeight: 700,
                              color: '#0C447C',
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: '#5a7a9a' }}>{c.role || 'Professional'}</div>
                          </div>
                        </div>

                        <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 12 }}>
                          {c.company || 'Company'}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={connected ? btnO : btnP} onClick={() => handleConnect(c.id)}>
                            {connected ? 'Connected' : 'Connect'}
                          </button>
                          {connected && (
                            <button style={btnO} onClick={() => setActiveChatId(c.id)}>
                              Chat
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {myConnected.length > 0 && (
                <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #D0E2F4', fontWeight: 700, color: '#0C447C' }}>
                    Messages
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '118px 1fr', minHeight: 420 }}>
                    <div style={{ borderRight: '1px solid #D0E2F4', background: '#fff' }}>
                      {myConnected.map((c) => {
                        const initials = (c.name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                        return (
                          <button
                            key={c.id}
                            onClick={() => setActiveChatId(c.id)}
                            style={{
                              width: '100%',
                              border: 'none',
                              background: activeChatId === c.id ? '#F0F6FD' : '#fff',
                              padding: '14px 10px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #EEF4FB',
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                background: '#B5D4F4',
                                margin: '0 auto 8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                color: '#0C447C',
                                fontSize: 12,
                              }}
                            >
                              {initials}
                            </div>
                            <div style={{ fontSize: 12, color: '#0C447C', fontWeight: 600 }}>{c.name}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {activeContact ? (
                        <>
                          <div
                            style={{
                              flex: 1,
                              padding: '14px',
                              overflowY: 'auto',
                              background: '#fff',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                            }}
                          >
                            {chatMsgs.length === 0 ? (
                              <div style={{ fontSize: 12, color: '#5a7a9a', textAlign: 'center', marginTop: 110 }}>
                                Select a contact to chat
                              </div>
                            ) : (
                              chatMsgs.map((m) => {
                                const mine = m.from === (user?.email || 'student');
                                return (
                                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                                    {!mine && <div style={{ fontSize: 10, color: '#5a7a9a', marginBottom: 2 }}>{m.fromName}</div>}
                                    <div
                                      style={{
                                        maxWidth: '75%',
                                        padding: '8px 11px',
                                        borderRadius: mine ? '11px 11px 3px 11px' : '11px 11px 11px 3px',
                                        background: mine ? '#185FA5' : '#fff',
                                        color: mine ? '#fff' : '#1a3a5c',
                                        fontSize: 12,
                                        border: mine ? 'none' : '1px solid #D0E2F4',
                                      }}
                                    >
                                      {m.text}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          <div style={{ padding: '12px', borderTop: '1px solid #D0E2F4', display: 'flex', gap: 8 }}>
                            <input
                              style={{
                                flex: 1,
                                border: '1px solid #D0E2F4',
                                borderRadius: 7,
                                padding: '8px 12px',
                                fontSize: 12,
                                outline: 'none',
                              }}
                              placeholder="Type a message…"
                              value={inputMsg}
                              onChange={(e) => setInputMsg(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') sendMessage();
                              }}
                            />
                            <button style={btnP} onClick={sendMessage}>Send</button>
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 12, color: '#5a7a9a', textAlign: 'center', marginTop: 160 }}>
                          Select a contact to chat
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSection === 'schedule' && (
        <div>
          {events.length === 0 ? (
            <div style={emptyBox}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Schedule Yet</div>
              <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 4 }}>
                No networking events have been added yet.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {events.map((e, i) => (
                <div key={e.id || i} style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C', marginBottom: 4 }}>
                        {e.icon || '📅'} {e.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#378ADD', marginBottom: 4 }}>
                        {e.time || 'Time TBD'}
                      </div>
                      {e.speaker && (
                        <div style={{ fontSize: 12, color: '#5a7a9a' }}>
                          {e.speaker}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {e.live && (
                        <>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              background: '#EAF3DE',
                              color: '#27500A',
                              border: '1px solid #C0DD97',
                              padding: '2px 8px',
                              borderRadius: 20,
                            }}
                          >
                            LIVE
                          </span>
                          <button
                            style={btnP}
                            onClick={() => {
                              if (e.meetLink) {
                                window.open(e.meetLink, '_blank');
                              } else {
                                const liveSession = sessions.find((s) => s.active);
                                if (liveSession) {
                                  if (liveSession.type === 'video' && liveSession.meetLink) {
                                    window.open(liveSession.meetLink, '_blank');
                                  } else if (liveSession.type === 'chat') {
                                    openChat(liveSession.title);
                                  } else {
                                    alert('No live join link available.');
                                  }
                                } else {
                                  alert('No active live session available right now.');
                                }
                              }
                            }}
                          >
                            Join Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'sessions' && (
        <div>
          {sessions.length === 0 ? (
            <div style={emptyBox}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎥</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Live Sessions</div>
              <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 4 }}>
                No live sessions are available right now.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {sessions.map((s, i) => (
                <div key={s.id || i} style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C' }}>
                          {s.type === 'video' ? '🎥' : '💬'} {s.title}
                        </div>

                        {s.active && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              background: '#EAF3DE',
                              color: '#27500A',
                              border: '1px solid #C0DD97',
                              padding: '2px 8px',
                              borderRadius: 20,
                            }}
                          >
                            LIVE
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 4 }}>
                        {s.description || 'Live session'}
                      </div>

                      {s.scheduledAt && (
                        <div style={{ fontSize: 12, color: '#378ADD', marginBottom: 4 }}>
                          {new Date(s.scheduledAt).toLocaleString()}
                        </div>
                      )}

                      <div style={{ fontSize: 11, color: '#5a7a9a' }}>
                        Type: {s.type === 'video' ? 'Video Meet' : 'Live Chat'}
                      </div>
                    </div>

                    <div>
                      {s.active ? (
                        <>
                          {s.type === 'video' && s.meetLink && (
                            <a
                              href={s.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                ...btnP,
                                textDecoration: 'none',
                                display: 'inline-block',
                              }}
                            >
                              Join Video
                            </a>
                          )}

                          {s.type === 'chat' && (
                            <button
                              style={btnP}
                              onClick={() => openChat(s.title)}
                            >
                              Join Chat
                            </button>
                          )}
                        </>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            color: '#5a7a9a',
                            border: '1px solid #D0E2F4',
                            borderRadius: 20,
                            padding: '4px 10px',
                            display: 'inline-block',
                          }}
                        >
                          Not Live Yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Studentdashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('Home');
  const [careerFairs, setCareerFairs] = useState([]);
  const [registeredFairs, setRegisteredFairs] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    try { setCareerFairs(JSON.parse(localStorage.getItem('careerFairs') || '[]')); } catch (_) {}
    try { setRegisteredFairs(JSON.parse(localStorage.getItem('registeredFairs') || '[]')); } catch (_) {}
  }, []);

  useEffect(() => {
    const fetchResumeCount = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(`http://localhost:8082/api/resumes/student/${user.email}`);
        if (!res.ok) return;
        const data = await res.json();
        setResumeCount(Array.isArray(data) ? data.length : 0);
      } catch (_) {}
    };

    fetchResumeCount();
  }, [user?.email]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    navigate('/login');
  };

  const handleRegisterFair = (fair) => {
    const exists = registeredFairs.some((f) => f.id === fair.id);
    if (exists) return;

    const updated = [...registeredFairs, fair];
    setRegisteredFairs(updated);
    localStorage.setItem('registeredFairs', JSON.stringify(updated));
  };

  return (
    <div style={page}>
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
          <Link to="/student/dashboard" style={navActive}>Dashboard</Link>
          <Link to="/profile" style={navBtn}>Profile</Link>
          <button onClick={handleLogout} style={{ ...navBtn, color: '#A32D2D', fontWeight: 600 }}>Logout</button>
        </div>
      </div>

      <div style={hero}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0C447C', marginBottom: 3 }}>
          Welcome back, {user?.name || 'Student'}! 👋
        </div>
        <div style={{ fontSize: 13, color: '#5a7a9a' }}>
          Explore career fairs, register for opportunities, and submit your resume
        </div>
      </div>

      <div style={tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #185FA5' : '2px solid transparent',
              color: activeTab === tab ? '#185FA5' : '#5a7a9a',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 13,
              padding: '14px 16px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={content}>
        {activeTab === 'Home' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 22 }}>
              {[
                { label: 'Fairs Registered', v: registeredFairs.length },
                { label: 'Resumes Submitted', v: resumeCount },
                { label: 'Shortlisted', v: 0 },
              ].map((s) => (
                <div key={s.label} style={{ ...card, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#185FA5' }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: '#5a7a9a', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={secLabel}>Registered Fairs</div>
            {registeredFairs.length === 0 ? (
              <div style={emptyBox}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Fairs Registered Yet</div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 16, marginTop: 4 }}>
                  Browse career fairs and register to get started
                </div>
                <button style={btnP} onClick={() => setActiveTab('Career Fairs')}>Browse Career Fairs</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {registeredFairs.map((f) => (
                  <div key={f.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C' }}>{f.name}</div>
                      <span style={regBadge}>Registered</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#378ADD', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalIcon /> {f.date}
                    </div>
                    <div style={{ fontSize: 13, color: '#5a7a9a', marginBottom: 8 }}>{f.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Career Fairs' && (
          <div>
            <div style={secLabel}>Available Career Fairs</div>
            {careerFairs.length === 0 ? (
              <div style={emptyBox}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Fairs Available</div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginTop: 4 }}>
                  Admin has not posted any career fairs yet.
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {careerFairs.map((fair) => {
                  const isRegistered = registeredFairs.some((f) => f.id === fair.id);

                  return (
                    <div key={fair.id} style={card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C' }}>{fair.name}</div>
                        {isRegistered && <span style={regBadge}>Registered</span>}
                      </div>

                      <div style={{ fontSize: 12, color: '#378ADD', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalIcon /> {fair.date}
                      </div>

                      <div style={{ fontSize: 13, color: '#5a7a9a', marginBottom: 10 }}>{fair.description}</div>

                      {(fair.participatingCompanies || []).length > 0 && (
                        <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 14 }}>
                          Companies: {fair.participatingCompanies.join(', ')}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          style={isRegistered ? { ...btnO, opacity: 0.85 } : btnP}
                          onClick={() => handleRegisterFair(fair)}
                          disabled={isRegistered}
                        >
                          {isRegistered ? 'Already Registered' : 'Register for Fair'}
                        </button>
                        <button style={btnO}>View Details</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Submit Resume' && (
          <div>
            <div style={secLabel}>Submit Your Resume</div>

            {registeredFairs.length === 0 ? (
              <div style={emptyBox}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a3a5c' }}>No Registered Fairs</div>
                <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 16, marginTop: 4 }}>
                  Register for a career fair first
                </div>
                <button style={btnP} onClick={() => setActiveTab('Career Fairs')}>Browse Fairs</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {registeredFairs.map((f) => (
                  <div key={f.id} style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0C447C' }}>{f.name}</div>
                      <span style={regBadge}>Registered</span>
                    </div>

                    <div style={{ fontSize: 12, color: '#378ADD', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalIcon /> {f.date}
                    </div>

                    <div style={{ fontSize: 12, color: '#5a7a9a', marginBottom: 16 }}>
                      Upload your resume to apply for positions at companies participating in this fair.
                    </div>

                    <div style={{ background: '#F0F6FD', border: '1px solid #D0E2F4', borderRadius: 10, padding: 16 }}>
                      <ResumeUpload registeredFair={f} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Networking' && (
          <NetworkingTab
            user={user}
            openChat={(title) => {
              setSelectedCompany(title);
              setShowChat(true);
            }}
          />
        )}
      </div>

      {showChat && ChatPanel && (
        <ChatPanel
          companyName={selectedCompany}
          onClose={() => {
            setShowChat(false);
            setSelectedCompany('');
          }}
        />
      )}
    </div>
  );
};

export default Studentdashboard;