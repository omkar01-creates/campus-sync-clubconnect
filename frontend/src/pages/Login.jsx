import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { saveLogin, getError } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      saveLogin(res.data.token, res.data.user);
      // Admins go to the admin panel, students to their dashboard
      navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
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
          <h1>Welcome Back!</h1>
          <p className="muted">Login to continue your campus journey.</p>

          {error && <div className="alert alert-error" data-testid="login-error">{error}</div>}

          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)} required data-testid="login-email" />

          <label>Password</label>
          <div className="password-box">
            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password}
              onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} data-testid="login-toggle-password">
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} data-testid="login-submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register" data-testid="login-to-register">Register here</Link>
          </p>
        </form>
      </div>

      <div className="auth-image-side" style={{ backgroundImage: 'url(/images/login-side.jpg)' }}>
        <div className="auth-quote">"Good Communities Build Great People."<span></span></div>
      </div>
    </div>
  );
}

export default Login;
