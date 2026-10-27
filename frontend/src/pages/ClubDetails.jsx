import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api, { getUser, getError, getImage, getIcon, formatDate } from '../services/api';

function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [club, setClub] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [tab, setTab] = useState('about');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadClub() {
    try {
      const clubRes = await api.get(`/clubs/${id}`);
      setClub(clubRes.data);
      const eventsRes = await api.get('/events');
      setClubEvents(eventsRes.data.filter((event) => event.club_id === Number(id)));
      if (user) {
        const myRes = await api.get('/my-clubs');
        setIsMember(myRes.data.some((c) => c.id === Number(id)));
      }
    } catch (err) {
      setError(getError(err));
    }
  }

  useEffect(() => {
    loadClub();
  }, [id]);

  async function handleJoin() {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/clubs/${id}/join`);
      setMessage(res.data.message);
      loadClub();
    } catch (err) {
      setMessage(getError(err));
    }
  }

  if (error) {
    return <div><Navbar /><div className="container"><p className="empty">{error}</p></div></div>;
  }
  if (!club) {
    return <div><Navbar /><div className="container"><p className="empty">Loading...</p></div></div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container narrow">
        <Link to="/clubs" className="back-link" data-testid="back-to-clubs">
          <i className="fa-solid fa-arrow-left"></i> Back to Clubs
        </Link>

        <div className="detail-box">
          <img src={getImage(club.category)} alt={club.name} className="detail-banner" />
          <div className="detail-head">
            <span className="detail-logo"><i className={`fa-solid ${getIcon(club.category)}`}></i></span>
            <div className="detail-title">
              <h1 data-testid="club-name">{club.name}</h1>
              <span className="tag">{club.category}</span>
            </div>
            {isMember ? (
              <button className="btn btn-success" disabled data-testid="club-joined-btn">
                <i className="fa-solid fa-check"></i> Joined
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleJoin} data-testid="club-join-btn">Join Club</button>
            )}
          </div>

          {message && <div className="alert alert-info" data-testid="club-message">{message}</div>}

          <div className="detail-stats">
            <div><strong data-testid="club-member-count">{club.member_count}</strong><span>Members</span></div>
            <div><strong>{club.event_count}</strong><span>Events</span></div>
            <div><strong>{club.category}</strong><span>Category</span></div>
          </div>

          <div className="tabs">
            <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')} data-testid="club-tab-about">About</button>
            <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')} data-testid="club-tab-events">Events</button>
          </div>

          {tab === 'about' && (
            <div className="tab-body">
              <h3>About Us</h3>
              <p>{club.description || 'No description added yet.'}</p>
            </div>
          )}

          {tab === 'events' && (
            <div className="tab-body">
              {clubEvents.length === 0 && <p className="muted">This club has no events yet.</p>}
              {clubEvents.map((event) => (
                <Link to={`/events/${event.id}`} className="mini-row" key={event.id}>
                  <strong>{event.name}</strong>
                  <span>{formatDate(event.date)} · {event.venue}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubDetails;
