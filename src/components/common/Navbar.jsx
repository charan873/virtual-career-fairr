import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Companies", path: "/companies" },
  { label: "Schedule",  path: "/events" },
  { label: "Network",   path: "/networking" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [notifs, setNotifs]       = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock auth — swap with your AuthContext
  const user = { name: "Arjun Sharma", role: "student", initials: "AS" };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <nav style={{
        ...styles.nav,
        ...(scrolled ? styles.navScrolled : {}),
      }}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoMark}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#6c8cff"/>
              <path d="M2 17l10 5 10-5" stroke="#e8c547" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="#6c8cff" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <span style={styles.logoText}>CareerFair<span style={styles.logoAccent}>.io</span></span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.navLink,
                ...(isActive(link.path) ? styles.navLinkActive : {}),
              }}
            >
              {isActive(link.path) && <span style={styles.activeDot} />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {/* Notification Bell */}
          <button style={styles.iconBtn} title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {notifs > 0 && (
              <span style={styles.notifBadge}>{notifs}</span>
            )}
          </button>

          {/* Avatar / Profile */}
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>{user.initials}</div>
            <div style={styles.avatarInfo}>
              <span style={styles.avatarName}>{user.name.split(" ")[0]}</span>
              <span style={styles.avatarRole}>{user.role}</span>
            </div>
          </div>

          {/* Hamburger */}
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar1Open : {}) }} />
            <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar3Open : {}) }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.mobileLink,
                animationDelay: `${i * 60}ms`,
                ...(isActive(link.path) ? styles.mobileLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={styles.mobileDivider} />
          <Link to="/profile" style={styles.mobileLink}>My Profile</Link>
          <button
            style={{ ...styles.mobileLink, ...styles.mobileLogout, border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
            onClick={() => navigate("/login")}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Spacer */}
      <div style={{ height: "64px" }} />
    </>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    background: "rgba(8,12,20,0.6)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "all 250ms ease",
  },
  navScrolled: {
    background: "rgba(8,12,20,0.92)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  },
  logoMark: {
    width: "34px",
    height: "34px",
    background: "rgba(108,140,255,0.12)",
    borderRadius: "8px",
    border: "1px solid rgba(108,140,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "17px",
    color: "#f0f4ff",
    letterSpacing: "-0.03em",
  },
  logoAccent: { color: "#6c8cff" },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#8896b3",
    textDecoration: "none",
    transition: "all 150ms ease",
    position: "relative",
  },
  navLinkActive: {
    color: "#f0f4ff",
    background: "rgba(255,255,255,0.06)",
  },
  activeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#6c8cff",
    boxShadow: "0 0 6px rgba(108,140,255,0.8)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  iconBtn: {
    position: "relative",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#8896b3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 150ms ease",
  },
  notifBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#6c8cff",
    color: "#fff",
    fontSize: "9px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #080c14",
  },
  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "5px 12px 5px 5px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    cursor: "pointer",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "7px",
    background: "linear-gradient(135deg, #6c8cff, #4c6ef5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.03em",
  },
  avatarInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  avatarName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#f0f4ff",
    lineHeight: 1,
  },
  avatarRole: {
    fontSize: "10px",
    color: "#6c8cff",
    fontWeight: 500,
    textTransform: "capitalize",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
  },
  bar: {
    display: "block",
    width: "20px",
    height: "2px",
    background: "#8896b3",
    borderRadius: "2px",
    transition: "all 250ms ease",
  },
  bar1Open: { transform: "rotate(45deg) translate(5px, 5px)" },
  bar3Open: { transform: "rotate(-45deg) translate(5px, -5px)" },
  mobileMenu: {
    position: "fixed",
    top: "64px",
    left: 0,
    right: 0,
    zIndex: 999,
    background: "rgba(13,18,32,0.98)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    animation: "fadeInUp 0.2s ease",
  },
  mobileLink: {
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 500,
    color: "#8896b3",
    textDecoration: "none",
    display: "block",
    animation: "fadeInUp 0.3s ease both",
    background: "none",
  },
  mobileLinkActive: {
    color: "#f0f4ff",
    background: "rgba(108,140,255,0.10)",
  },
  mobileDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "8px 0",
  },
  mobileLogout: { color: "#f87171" },
};
