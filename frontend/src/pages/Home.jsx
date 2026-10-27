import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: 'fa-users', title: 'Join Clubs', text: 'Be a part of communities that share your interests.' },
  { icon: 'fa-calendar-days', title: 'Attend Events', text: 'Workshops, fests, competitions and more.' },
  { icon: 'fa-handshake', title: 'Grow Together', text: 'Learn, network and build lasting friendships.' }
];

function Home() {
  return (
    <div>
      <Navbar />

      <section className="hero" style={{ backgroundImage: 'url(/images/hero.jpg)' }}>
        <div className="hero-content">
          <h1 data-testid="hero-title">CampusConnect</h1>
          <h2>Discover Clubs. Join Events. Build Your Community.</h2>
          <p>Be a part of a vibrant campus life with like-minded people.</p>
          <div className="hero-buttons">
            <Link to="/clubs" className="btn btn-primary btn-lg" data-testid="hero-explore-clubs">Explore Clubs</Link>
            <Link to="/events" className="btn btn-ghost btn-lg" data-testid="hero-view-events">View Events</Link>
          </div>
        </div>
      </section>

      <section className="features">
        {features.map((item) => (
          <div className="feature-card" key={item.title}>
            <span className="feature-icon"><i className={`fa-solid ${item.icon}`}></i></span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} CampusConnect · College Club & Event Management System
      </footer>
    </div>
  );
}

export default Home;
