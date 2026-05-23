import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link nav-link--active' : 'nav-link';
}

export function Layout() {
  const { user, isAgent, isAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              P
            </span>
            Propertist
          </Link>
          <nav className="nav">
            <NavLink to="/" end className={navLinkClass}>
              Listings
            </NavLink>
            {isAuthenticated && isAgent && (
              <>
                <NavLink to="/add-property" className={navLinkClass}>
                  Add Property
                </NavLink>
                <NavLink to="/my-properties" className={navLinkClass}>
                  My Properties
                </NavLink>
              </>
            )}
            {isAuthenticated && user ? (
              <>
                <span className="nav-user-badge">
                  {user.first_name}
                  <span className="nav-user-role">
                    {user.role === 'agent' ? 'Agent' : 'Home Seeker'}
                  </span>
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `btn btn-primary btn-sm${isActive ? ' nav-link--active' : ''}`
                  }
                >
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true">
              P
            </span>
            <strong>Propertist</strong>
            <p>Connecting people &amp; property</p>
          </div>
          <div className="footer-links">
            <Link to="/">Browse listings</Link>
            {isAuthenticated && isAgent && (
              <Link to="/add-property">List a property</Link>
            )}
            {!isAuthenticated && <Link to="/register">Create account</Link>}
          </div>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Propertist — Property listing assignment
        </p>
      </footer>
    </div>
  );
}
