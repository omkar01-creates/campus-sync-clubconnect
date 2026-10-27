import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getUser, logout, getError, formatDate } from '../services/api';

const emptyClub = { name: '', category: '', description: '' };
const emptyEvent = { club_id: '', name: '', description: '', date: '', venue: '' };

function Admin() {
  const navigate = useNavigate();
  const user = getUser();
  const [tab, setTab] = useState('dashboard');
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // Load everything the admin pages need
  async function loadAll() {
    const [clubsRes, eventsRes, usersRes, regRes] = await Promise.all([
      api.get('/clubs'), api.get('/events'), api.get('/users'), api.get('/registrations')
    ]);
    setClubs(clubsRes.data);
    setEvents(eventsRes.data);
    setUsers(usersRes.data);
    setRegistrations(regRes.data);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const menu = [
    { key: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { key: 'clubs', icon: 'fa-users', label: 'Manage Clubs' },
    { key: 'events', icon: 'fa-calendar-days', label: 'Manage Events' },
    { key: 'users', icon: 'fa-user-gear', label: 'Manage Users' },
    { key: 'registrations', icon: 'fa-clipboard-list', label: 'Registrations' }
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand"><i className="fa-solid fa-graduation-cap"></i> CampusConnect</Link>
        <nav className="sidebar-links">
          {menu.map((item) => (
            <button key={item.key} className={tab === item.key ? 'active' : ''}
              onClick={() => setTab(item.key)} data-testid={`admin-menu-${item.key}`}>
              <i className={`fa-solid ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={handleLogout} data-testid="admin-logout">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </aside>

      <main className="app-main">
        <div className="topbar">
          <div className="topbar-user">
            <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
            <div><strong>{user.name}</strong><small>Admin</small></div>
          </div>
        </div>
        <div className="app-content">
          {tab === 'dashboard' && <AdminHome clubs={clubs} events={events} users={users} registrations={registrations} />}
          {tab === 'clubs' && <ManageClubs clubs={clubs} reload={loadAll} />}
          {tab === 'events' && <ManageEvents events={events} clubs={clubs} reload={loadAll} />}
          {tab === 'users' && <UsersTable users={users} />}
          {tab === 'registrations' && <RegistrationsTable registrations={registrations} />}
        </div>
      </main>
    </div>
  );
}

// ---------- Dashboard summary ----------
function AdminHome({ clubs, events, users, registrations }) {
  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="muted">Manage clubs, events and users.</p>

      <div className="stats">
        <div className="stat-card stat-row">
          <span className="stat-icon green"><i className="fa-solid fa-users"></i></span>
          <div><strong data-testid="admin-total-clubs">{clubs.length}</strong><span>Total Clubs</span></div>
        </div>
        <div className="stat-card stat-row">
          <span className="stat-icon blue"><i className="fa-solid fa-calendar-days"></i></span>
          <div><strong data-testid="admin-total-events">{events.length}</strong><span>Total Events</span></div>
        </div>
        <div className="stat-card stat-row">
          <span className="stat-icon orange"><i className="fa-solid fa-user-group"></i></span>
          <div><strong data-testid="admin-total-users">{users.length}</strong><span>Total Users</span></div>
        </div>
      </div>

      <h2 className="sub-title">Recent Registrations</h2>
      <RegistrationRows registrations={registrations.slice(0, 5)} />
    </div>
  );
}

// ---------- Clubs: add / edit / delete ----------
function ManageClubs({ clubs, reload }) {
  const [form, setForm] = useState(emptyClub);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(club) {
    setEditingId(club.id);
    setForm({ name: club.name, category: club.category, description: club.description || '' });
    setMessage('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyClub);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = editingId
        ? await api.put(`/clubs/${editingId}`, form)
        : await api.post('/clubs', form);
      setMessage(res.data.message);
      cancelEdit();
      reload();
    } catch (err) {
      setMessage(getError(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this club? Its events will also be deleted.')) return;
    try {
      const res = await api.delete(`/clubs/${id}`);
      setMessage(res.data.message);
      reload();
    } catch (err) {
      setMessage(getError(err));
    }
  }

  return (
    <div>
      <h1 className="page-title">Manage Clubs</h1>

      <form className="admin-form" onSubmit={handleSubmit} data-testid="club-form">
        <h3>{editingId ? 'Edit Club' : 'Add New Club'}</h3>
        <div className="form-grid">
          <input name="name" placeholder="Club name" value={form.name} onChange={handleChange} required data-testid="club-form-name" />
          <input name="category" placeholder="Category (e.g. Technology)" value={form.category} onChange={handleChange} required data-testid="club-form-category" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" data-testid="club-form-description" />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" data-testid="club-form-submit">
            <i className="fa-solid fa-plus"></i> {editingId ? 'Update Club' : 'Add Club'}
          </button>
          {editingId && <button type="button" className="btn btn-outline" onClick={cancelEdit} data-testid="club-form-cancel">Cancel</button>}
        </div>
        {message && <div className="alert alert-info" data-testid="club-form-message">{message}</div>}
      </form>

      <div className="table-box">
        <table>
          <thead>
            <tr><th>#</th><th>Club Name</th><th>Category</th><th>Members</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {clubs.map((club, index) => (
              <tr key={club.id} data-testid={`admin-club-row-${club.id}`}>
                <td>{index + 1}</td>
                <td>{club.name}</td>
                <td>{club.category}</td>
                <td>{club.member_count}</td>
                <td className="actions">
                  <button className="btn btn-outline btn-xs" onClick={() => startEdit(club)} data-testid={`admin-club-edit-${club.id}`}>Edit</button>
                  <button className="btn btn-danger-outline btn-xs" onClick={() => handleDelete(club.id)} data-testid={`admin-club-delete-${club.id}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Events: add / edit / delete ----------
function ManageEvents({ events, clubs, reload }) {
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      club_id: event.club_id,
      name: event.name,
      description: event.description || '',
      date: event.date,
      venue: event.venue
    });
    setMessage('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyEvent);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = editingId
        ? await api.put(`/events/${editingId}`, form)
        : await api.post('/events', form);
      setMessage(res.data.message);
      cancelEdit();
      reload();
    } catch (err) {
      setMessage(getError(err));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      const res = await api.delete(`/events/${id}`);
      setMessage(res.data.message);
      reload();
    } catch (err) {
      setMessage(getError(err));
    }
  }

  return (
    <div>
      <h1 className="page-title">Manage Events</h1>

      <form className="admin-form" onSubmit={handleSubmit} data-testid="event-form">
        <h3>{editingId ? 'Edit Event' : 'Add New Event'}</h3>
        <div className="form-grid">
          <input name="name" placeholder="Event name" value={form.name} onChange={handleChange} required data-testid="event-form-name" />
          <select name="club_id" value={form.club_id} onChange={handleChange} required data-testid="event-form-club">
            <option value="">Select club</option>
            {clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
          </select>
          <input type="date" name="date" value={form.date} onChange={handleChange} required data-testid="event-form-date" />
          <input name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} required data-testid="event-form-venue" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" data-testid="event-form-description" />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" data-testid="event-form-submit">
            <i className="fa-solid fa-plus"></i> {editingId ? 'Update Event' : 'Add Event'}
          </button>
          {editingId && <button type="button" className="btn btn-outline" onClick={cancelEdit} data-testid="event-form-cancel">Cancel</button>}
        </div>
        {message && <div className="alert alert-info" data-testid="event-form-message">{message}</div>}
      </form>

      <div className="table-box">
        <table>
          <thead>
            <tr><th>#</th><th>Event</th><th>Club</th><th>Date</th><th>Venue</th><th>Registrations</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event.id} data-testid={`admin-event-row-${event.id}`}>
                <td>{index + 1}</td>
                <td>{event.name}</td>
                <td>{event.club_name}</td>
                <td>{formatDate(event.date)}</td>
                <td>{event.venue}</td>
                <td>{event.registration_count}</td>
                <td className="actions">
                  <button className="btn btn-outline btn-xs" onClick={() => startEdit(event)} data-testid={`admin-event-edit-${event.id}`}>Edit</button>
                  <button className="btn btn-danger-outline btn-xs" onClick={() => handleDelete(event.id)} data-testid={`admin-event-delete-${event.id}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Users ----------
function UsersTable({ users }) {
  return (
    <div>
      <h1 className="page-title">Registered Users</h1>
      <div className="table-box">
        <table data-testid="users-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Clubs Joined</th><th>Events Registered</th></tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={u.role === 'ADMIN' ? 'badge-purple' : 'badge-blue'}>{u.role}</span></td>
                <td>{u.club_count}</td>
                <td>{u.event_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Event registrations ----------
function RegistrationsTable({ registrations }) {
  return (
    <div>
      <h1 className="page-title">Event Registrations</h1>
      <RegistrationRows registrations={registrations} />
    </div>
  );
}

function RegistrationRows({ registrations }) {
  if (registrations.length === 0) {
    return <p className="empty">No registrations yet.</p>;
  }
  return (
    <div className="table-box">
      <table data-testid="registrations-table">
        <thead>
          <tr><th>#</th><th>User</th><th>Email</th><th>Event</th><th>Club</th><th>Event Date</th></tr>
        </thead>
        <tbody>
          {registrations.map((r, index) => (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{r.user_name}</td>
              <td>{r.user_email}</td>
              <td>{r.event_name}</td>
              <td>{r.club_name}</td>
              <td>{formatDate(r.event_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
