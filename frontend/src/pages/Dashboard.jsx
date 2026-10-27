import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../components/Navbar';
import EventCard from '../components/EventCard';
import api, { getUser, getError, todayString } from '../services/api';

function Dashboard() {
  const user = getUser();
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  async function loadData() {
    const clubsRes = await api.get('/my-clubs');
    const myEventsRes = await api.get('/my-events');
    const eventsRes = await api.get('/events');
    setMyClubs(clubsRes.data);
    setMyEvents(myEventsRes.data);
    // Keep only events from today onwards
    setUpcoming(eventsRes.data.filter((event) => event.date >= todayString()));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRegister(eventId) {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      alert(res.data.message);
      loadData();
    } catch (err) {
      alert(getError(err));
    }
  }

  const registeredIds = myEvents.map((event) => event.id);

  return (
    <StudentLayout>
      <h1 className="page-title" data-testid="dashboard-welcome">Welcome, {user.name.split(' ')[0]}!</h1>
      <p className="muted">Here's what's happening on campus.</p>

      <div className="stats">
        <div className="stat-card">
          <strong className="stat-blue" data-testid="stat-my-clubs">{myClubs.length}</strong>
          <span>My Clubs</span>
        </div>
        <div className="stat-card">
          <strong className="stat-red" data-testid="stat-my-events">{myEvents.length}</strong>
          <span>Registered Events</span>
        </div>
        <div className="stat-card">
          <strong className="stat-purple" data-testid="stat-upcoming">{upcoming.length}</strong>
          <span>Upcoming Events</span>
        </div>
      </div>

      <div className="section-head">
        <h2>Upcoming Events</h2>
        <Link to="/events" data-testid="dashboard-view-all">View All</Link>
      </div>

      {upcoming.length === 0 && <p className="empty">No upcoming events right now.</p>}

      <div className="grid grid-3">
        {upcoming.slice(0, 3).map((event) => (
          <EventCard key={event.id} event={event}
            isRegistered={registeredIds.includes(event.id)} onRegister={handleRegister} />
        ))}
      </div>
    </StudentLayout>
  );
}

export default Dashboard;
