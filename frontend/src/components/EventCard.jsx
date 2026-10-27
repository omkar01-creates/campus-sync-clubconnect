import { Link } from 'react-router-dom';
import { getImage, formatDate } from '../services/api';

// One event shown as a card (Events page and Dashboard)
function EventCard({ event, isRegistered, onRegister }) {
  return (
    <div className="card" data-testid={`event-card-${event.id}`}>
      <Link to={`/events/${event.id}`}>
        <img src={getImage(event.club_category)} alt={event.name} className="card-img" />
      </Link>
      <div className="card-body">
        <Link to={`/events/${event.id}`} className="card-title-link">
          <h3>{event.name}</h3>
        </Link>
        <p className="card-sub">{event.club_name}</p>
        <p className="card-meta"><i className="fa-regular fa-calendar"></i> {formatDate(event.date)}</p>
        <p className="card-meta"><i className="fa-solid fa-location-dot"></i> {event.venue}</p>

        {isRegistered ? (
          <button className="btn btn-success btn-block" disabled data-testid={`event-registered-${event.id}`}>
            <i className="fa-solid fa-check"></i> Registered
          </button>
        ) : (
          <button className="btn btn-primary btn-block" onClick={() => onRegister(event.id)} data-testid={`event-register-${event.id}`}>
            Register
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
