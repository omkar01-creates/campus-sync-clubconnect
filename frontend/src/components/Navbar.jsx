import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/api';

// Top navigation bar used on public pages
function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" data-testid="navbar-brand">
        <i className="fa-solid fa-graduation-cap"></i> CampusConnect
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end data-testid="nav-home">Home</NavLink>
        <NavLink to="/clubs" data-testid="nav-clubs">Clubs</NavLink>
        <NavLink to="/events" data-testid="nav-events">Events</NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn btn-outline btn-sm" data-testid="nav-dashboard">
              Dashboard
            </Link>
            <button className="btn btn-primary btn-sm" onClick={handleLogout} data-testid="nav-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-login" data-testid="nav-login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm" data-testid="nav-register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

// Sidebar + top bar layout used on student pages (Dashboard, My Clubs, My Events)
export function StudentLayout({ children }) {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          <i className="fa-solid fa-graduation-cap"></i> CampusConnect
        </Link>
        <nav className="sidebar-links">
          <NavLink to="/dashboard" data-testid="side-dashboard"><i className="fa-solid fa-house"></i> Dashboard</NavLink>
          <NavLink to="/clubs" data-testid="side-clubs"><i className="fa-solid fa-users"></i> Clubs</NavLink>
          <NavLink to="/events" data-testid="side-events"><i className="fa-regular fa-calendar"></i> Events</NavLink>
          <NavLink to="/my-clubs" data-testid="side-my-clubs"><i className="fa-solid fa-user-group"></i> My Clubs</NavLink>
          <NavLink to="/my-events" data-testid="side-my-events"><i className="fa-regular fa-calendar-check"></i> My Events</NavLink>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout} data-testid="side-logout">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </aside>

      <main className="app-main">
        <div className="topbar">
          <div className="topbar-user" data-testid="topbar-user">
            <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role === 'ADMIN' ? 'Admin' : 'Student'}</small>
            </div>
          </div>
        </div>
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

export default Navbar;
