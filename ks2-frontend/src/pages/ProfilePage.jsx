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
        <DashboardNav email={currentUser?.email} />

        <header className="dashboard-header">
          <div>
            <p className="dashboard-header__eyebrow">Profile Settings</p>
            <h1 className="dashboard-header__title">Manage your account</h1>
            <p className="dashboard-header__description">
              Update your profile information or delete your account and related houses.
            </p>
          </div>
        </header>

        <ProfilePanel currentUser={currentUser} onProfileUpdated={setCurrentUser} />

        <div className="dashboard-profile__back-wrap">
          <Link to="/home" className="dashboard-profile__back-link">
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
