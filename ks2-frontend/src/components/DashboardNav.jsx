import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { clearAuthSession } from '../utils/authStorage';
import UserSolidIcon from './UserSolidIcon';

function DashboardNav({ email }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuthSession();
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="dashboard-nav">
      <div>
        <p className="dashboard-nav__eyebrow">KS2 Dashboard</p>
        <p className="dashboard-nav__email">{email || 'Authenticated user'}</p>
      </div>

      <div className="dashboard-nav__menu-wrap">
        <button
          type="button"
          className="dashboard-nav__icon"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Open user menu"
        >
          <UserSolidIcon />
        </button>

        {menuOpen ? (
          <div className="dashboard-nav__menu">
            <button
              type="button"
              className="dashboard-nav__menu-item"
              onClick={() => {
                setMenuOpen(false);
                navigate('/profile');
              }}
            >
              Profile
            </button>
            <button
              type="button"
              className="dashboard-nav__menu-item dashboard-nav__menu-item--danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default DashboardNav;
