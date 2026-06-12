import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import ProfilePanel from '../components/ProfilePanel';
import { getCurrentUser } from '../utils/authStorage';

function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <DashboardNav userName={currentUser?.name} />

        <header className="dashboard-header">
          <div>
            <p className="dashboard-header__eyebrow">Configuracion de perfil</p>
            <h1 className="dashboard-header__title">Administra tu cuenta</h1>
            <p className="dashboard-header__description">
              Actualiza tu perfil o elimina tu cuenta junto con los inmuebles relacionados.
            </p>
          </div>
        </header>

        <ProfilePanel currentUser={currentUser} onProfileUpdated={setCurrentUser} />

        <div className="dashboard-profile__back-wrap">
          <Link to="/home" className="dashboard-profile__back-link">
            Volver al panel
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
