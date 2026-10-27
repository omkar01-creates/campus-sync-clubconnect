import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import api, { getUser, getError } from '../services/api';

function Events() {
  const navigate = useNavigate();
  const user = getUser();
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [search, setSearch] = useState('');
  const [clubName, setClubName] = useState('All');
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    const res = await api.get('/events');
    setEvents(res.data);
    if (user) {
      const myRes = await api.get('/my-events');
      setRegisteredIds(myRes.data.map((event) => event.id));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleRegister(eventId) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/events/${eventId}/register`);
      alert(res.data.message);
      setRegisteredIds([...registeredIds, eventId]);
    } catch (err) {
      alert(getError(err));
    }
  }

  const clubNames = ['All', ...new Set(events.map((event) => event.club_name))];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase());
    const matchesClub = clubName === 'All' || event.club_name === clubName;
    return matchesSearch && matchesClub;
  });

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-head">
          <div>
            <h1 className="page-title">All Events</h1>
            <p className="muted">Participate in exciting events across different clubs.</p>
          </div>
          <div className="filters">
            <input type="text" placeholder="Search events..." value={search}
              onChange={(e) => setSearch(e.target.value)} data-testid="events-search" />
            <select value={clubName} onChange={(e) => setClubName(e.target.value)} data-testid="events-club-filter">
              {clubNames.map((name) => (
                <option key={name} value={name}>{name === 'All' ? 'All Clubs' : name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="empty">Loading events...</p>}
        {!loading && filteredEvents.length === 0 && <p className="empty">No events found.</p>}

        <div className="grid grid-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event}
              isRegistered={registeredIds.includes(event.id)} onRegister={handleRegister} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
