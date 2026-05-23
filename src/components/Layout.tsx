import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, isAgent, isAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          Propertist
        </Link>
        <nav className="nav">
          <Link to="/">Listings</Link>
          {isAuthenticated && isAgent && (
            <>
              <Link to="/add-property">Add Property</Link>
              <Link to="/my-properties">My Properties</Link>
            </>
          )}
          {isAuthenticated && user ? (
            <>
              <span className="nav-user">
                {user.first_name} ({user.role === 'agent' ? 'Agent' : 'Home Seeker'})
              </span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Property Listing — Propertist Assignment</p>
      </footer>
    </div>
  );
}
