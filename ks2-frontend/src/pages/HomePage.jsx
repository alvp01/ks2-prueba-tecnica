import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { clearAuthSession, getCurrentUser } from '../utils/authStorage';

function HomePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuthSession();
      navigate('/login', { replace: true });
    }
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <nav className="dashboard-nav">
          <div>
            <p className="dashboard-nav__eyebrow">KS2 Dashboard</p>
            <p className="dashboard-nav__email">{user?.email || 'Authenticated user'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="dashboard-nav__logout"
          >
            Logout
          </button>
        </nav>

        <header className="dashboard-header">
          <div>
            <p className="dashboard-header__eyebrow">Protected Area</p>
            <h1 className="dashboard-header__title">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="dashboard-header__description">
              You are authenticated and can now access secure dashboard features.
            </p>
          </div>
        </header>

        <div className="dashboard-grid">
          <article className="dashboard-stat">
            <p className="dashboard-stat__label">User ID</p>
            <p className="dashboard-stat__value">{user?.id || '-'}</p>
          </article>
          <article className="dashboard-stat">
            <p className="dashboard-stat__label">Email</p>
            <p className="dashboard-stat__value">{user?.email || '-'}</p>
          </article>
          <article className="dashboard-stat">
            <p className="dashboard-stat__label">Account status</p>
            <p className="dashboard-stat__value">
              {user?.isActive ? 'Active' : 'Inactive'}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
