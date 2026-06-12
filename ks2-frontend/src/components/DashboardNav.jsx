import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { clearAuthSession } from '../utils/authStorage';
import UserSolidIcon from './UserSolidIcon';

function DashboardNav({ userName }) {
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
        <p className="dashboard-nav__eyebrow">Panel KS2</p>
        <p className="dashboard-nav__email">{userName || 'Usuario autenticado'}</p>
      </div>

      <div className="dashboard-nav__menu-wrap">
        <button
          type="button"
          className="dashboard-nav__icon"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Abrir menu de usuario"
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
              Perfil
            </button>
            <button
              type="button"
              className="dashboard-nav__menu-item dashboard-nav__menu-item--danger"
              onClick={handleLogout}
            >
              Cerrar sesion
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default DashboardNav;
