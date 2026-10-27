import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getError } from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Every public registration creates a STUDENT account
      const res = await api.post('/auth/register', { name, email, password });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(getError(err));
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <Link to="/" className="auth-brand">
            <i className="fa-solid fa-graduation-cap"></i>
            <span>CampusConnect</span>
          </Link>
          <h1>Create Your Account</h1>
          <p className="muted">Join the campus community.</p>

          {error && <div className="alert alert-error" data-testid="register-error">{error}</div>}
          {success && <div className="alert alert-success" data-testid="register-success">{success}</div>}

          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" value={name}
            onChange={(e) => setName(e.target.value)} required data-testid="register-name" />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)} required data-testid="register-email" />

          <label>Password</label>
          <div className="password-box">
            <input type={showPassword ? 'text' : 'password'} placeholder="Create a password (min 6 characters)" value={password}
              onChange={(e) => setPassword(e.target.value)} required data-testid="register-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} data-testid="register-toggle-password">
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} data-testid="register-submit">
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login" data-testid="register-to-login">Login here</Link>
          </p>
        </form>
      </div>

      <div className="auth-image-side" style={{ backgroundImage: 'url(/images/register-side.jpg)' }}>
        <div className="auth-quote">"Join. Explore. Participate. Grow."<span></span></div>
      </div>
    </div>
  );
}

export default Register;
