import { Link } from 'react-router-dom';
import { getImage } from '../services/api';

// One club shown as a card on the Clubs page
function ClubCard({ club }) {
  return (
    <div className="card" data-testid={`club-card-${club.id}`}>
      <img src={getImage(club.category)} alt={club.name} className="card-img" />
      <div className="card-body">
        <h3>{club.name}</h3>
        <span className="tag">{club.category}</span>
        <p className="card-text">{club.description}</p>
        <p className="card-meta">
          <i className="fa-solid fa-users"></i> {club.member_count} Members
        </p>
        <Link to={`/clubs/${club.id}`} className="btn btn-primary btn-block" data-testid={`club-view-${club.id}`}>
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ClubCard;
