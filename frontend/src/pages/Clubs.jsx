import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClubCard from '../components/ClubCard';
import api from '../services/api';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clubs')
      .then((res) => setClubs(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Unique list of categories for the dropdown
  const categories = ['All', ...new Set(clubs.map((club) => club.category))];

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || club.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-head">
          <div>
            <h1 className="page-title">All Clubs</h1>
            <p className="muted">Discover amazing clubs and be part of them.</p>
          </div>
          <div className="filters">
            <input type="text" placeholder="Search clubs..." value={search}
              onChange={(e) => setSearch(e.target.value)} data-testid="clubs-search" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} data-testid="clubs-category-filter">
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="empty">Loading clubs...</p>}
        {!loading && filteredClubs.length === 0 && <p className="empty">No clubs found.</p>}

        <div className="grid grid-3">
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Clubs;
