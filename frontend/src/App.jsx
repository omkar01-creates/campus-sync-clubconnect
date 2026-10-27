import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from './services/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import MyClubs from './pages/MyClubs';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import Admin from './pages/Admin';

// Shows the page only if the user is logged in (and has the right role)
function PrivateRoute({ children, role }) {
  const user = getUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/clubs/:id" element={<ClubDetails />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/my-clubs" element={<PrivateRoute><MyClubs /></PrivateRoute>} />
      <Route path="/my-events" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute role="ADMIN"><Admin /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
