import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../components/Navbar';
import api, { getImage, formatDate } from '../services/api';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/my-events')
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudentLayout>
      <h1 className="page-title">My Event Registrations</h1>
      <p className="muted">Events you have registered for.</p>

      {loading && <p className="empty">Loading...</p>}
      {!loading && events.length === 0 && (
        <p className="empty">You have not registered for any event yet. <Link to="/events">Browse events</Link></p>
      )}

      <div className="list">
        {events.map((event) => (
          <div className="list-row" key={event.id} data-testid={`my-event-${event.id}`}>
            <img src={getImage(event.club_category)} alt={event.name} className="row-img" />
            <div className="row-info">
              <h3>{event.name}</h3>
              <p className="muted">{event.club_name}</p>
              <p className="card-meta">
                <i className="fa-regular fa-calendar"></i> {formatDate(event.date)}
                &nbsp;&nbsp;<i className="fa-solid fa-location-dot"></i> {event.venue}
              </p>
            </div>
            <span className="badge-success">Registered</span>
            <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm" data-testid={`my-event-view-${event.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}

export default MyEvents;
