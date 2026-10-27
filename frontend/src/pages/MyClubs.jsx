import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../components/Navbar';
import api, { getError, getIcon, formatDate } from '../services/api';

function MyClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadClubs() {
    const res = await api.get('/my-clubs');
    setClubs(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadClubs();
  }, []);

  async function handleLeave(clubId) {
    if (!window.confirm('Are you sure you want to leave this club?')) return;
    try {
      await api.delete(`/clubs/${clubId}/leave`);
      loadClubs();
    } catch (err) {
      alert(getError(err));
    }
  }

  return (
    <StudentLayout>
      <h1 className="page-title">My Clubs</h1>
      <p className="muted">Clubs you have joined.</p>

      {loading && <p className="empty">Loading...</p>}
      {!loading && clubs.length === 0 && (
        <p className="empty">You have not joined any club yet. <Link to="/clubs">Browse clubs</Link></p>
      )}

      <div className="list">
        {clubs.map((club) => (
          <div className="list-row" key={club.id} data-testid={`my-club-${club.id}`}>
            <span className="row-logo"><i className={`fa-solid ${getIcon(club.category)}`}></i></span>
            <div className="row-info">
              <Link to={`/clubs/${club.id}`}><h3>{club.name}</h3></Link>
              <span className="tag">{club.category}</span>
              <p className="muted">{club.description}</p>
            </div>
            <span className="row-date">Joined on {formatDate(club.joined_at)}</span>
            <button className="btn btn-danger-outline btn-sm" onClick={() => handleLeave(club.id)} data-testid={`leave-club-${club.id}`}>
              Leave
            </button>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}

export default MyClubs;
