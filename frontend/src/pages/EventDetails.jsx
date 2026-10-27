import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api, { getUser, getError, getImage, getIcon, formatDate } from '../services/api';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadEvent() {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
      if (user) {
        const myRes = await api.get('/my-events');
        setIsRegistered(myRes.data.some((e) => e.id === Number(id)));
      }
    } catch (err) {
      setError(getError(err));
    }
  }

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function handleRegister() {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/events/${id}/register`);
      setMessage(res.data.message);
      loadEvent();
    } catch (err) {
      setMessage(getError(err));
    }
  }

  if (error) {
    return <div><Navbar /><div className="container"><p className="empty">{error}</p></div></div>;
  }
  if (!event) {
    return <div><Navbar /><div className="container"><p className="empty">Loading...</p></div></div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container narrow">
        <Link to="/events" className="back-link" data-testid="back-to-events">
          <i className="fa-solid fa-arrow-left"></i> Back to Events
        </Link>

        <div className="detail-box">
          <img src={getImage(event.club_category)} alt={event.name} className="detail-banner" />
          <div className="detail-head">
            <span className="detail-logo"><i className={`fa-solid ${getIcon(event.club_category)}`}></i></span>
            <div className="detail-title">
              <h1 data-testid="event-name">{event.name}</h1>
              <p className="muted">
                Organized by <Link to={`/clubs/${event.club_id}`}>{event.club_name}</Link>
              </p>
            </div>
            {isRegistered ? (
              <button className="btn btn-success" disabled data-testid="event-registered-btn">
                <i className="fa-solid fa-check"></i> Registered
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleRegister} data-testid="event-register-btn">Register</button>
            )}
          </div>

          {message && <div className="alert alert-info" data-testid="event-message">{message}</div>}

          <div className="info-row">
            <span><i className="fa-regular fa-calendar"></i> {formatDate(event.date)}</span>
            <span><i className="fa-solid fa-location-dot"></i> {event.venue}</span>
            <span data-testid="event-registration-count"><i className="fa-solid fa-user-check"></i> {event.registration_count} Registered</span>
          </div>

          <div className="tab-body">
            <h3>About Event</h3>
            <p>{event.description || 'No description added yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
