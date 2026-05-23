import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage, useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export function RegisterPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'home_seeker' as UserRole,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/login', { state: { message: 'Account created. Please login.' } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="auth-subtitle">Join as an agent or home seeker</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <label>
              First name
              <input
                required
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
            </label>
            <label>
              Last name
              <input
                required
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <fieldset className="role-select">
            <legend>I am a</legend>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="home_seeker"
                checked={form.role === 'home_seeker'}
                onChange={() => setForm({ ...form, role: 'home_seeker' })}
              />
              Home Seeker — browse &amp; enquire
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="agent"
                checked={form.role === 'agent'}
                onChange={() => setForm({ ...form, role: 'agent' })}
              />
              Agent — list &amp; manage properties
            </label>
          </fieldset>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
