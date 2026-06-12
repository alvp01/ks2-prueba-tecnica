import { useEffect, useState } from 'react';
import DashboardNav from '../components/DashboardNav';
import { listUsers } from '../services/userService';
import { getCurrentUser } from '../utils/authStorage';

function HomePage() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');

    try {
      const data = await listUsers();
      setUsers(data.users || []);
    } catch (error) {
      setUsersError(error.response?.data?.message || 'Could not load users list.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <DashboardNav email={currentUser?.email} />

        <header className="dashboard-header">
          <div>
            <p className="dashboard-header__eyebrow">Protected Area</p>
            <h1 className="dashboard-header__title">
              Welcome{currentUser?.name ? `, ${currentUser.name}` : ''}
            </h1>
            <p className="dashboard-header__description">
              You are authenticated and can now access secure dashboard features.
            </p>
          </div>
        </header>

        <div className="dashboard-grid">
          <article className="dashboard-stat">
            <p className="dashboard-stat__label">User ID</p>
            <p className="dashboard-stat__value">{currentUser?.id || '-'}</p>
          </article>
          <article className="dashboard-stat">
            <p className="dashboard-stat__label">Email</p>
            <p className="dashboard-stat__value">{currentUser?.email || '-'}</p>
          </article>
          <article className="dashboard-stat">
            <p className="dashboard-stat__label">Account status</p>
            <p className="dashboard-stat__value">
              {currentUser?.isActive ? 'Active' : 'Inactive'}
            </p>
          </article>
        </div>

        <section className="dashboard-users">
          <div className="dashboard-users__head">
            <h2 className="dashboard-users__title">Users</h2>
            <span className="dashboard-users__count">{users.length}</span>
          </div>

          {loadingUsers ? <p className="dashboard-users__state">Loading users...</p> : null}
          {usersError ? <p className="dashboard-users__error">{usersError}</p> : null}

          {!loadingUsers && !usersError ? (
            <div className="dashboard-users__table-wrap">
              <table className="dashboard-users__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((listedUser) => (
                    <tr key={listedUser.id}>
                      <td>{listedUser.id}</td>
                      <td>{listedUser.name}</td>
                      <td>{listedUser.email}</td>
                      <td>{listedUser.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}

export default HomePage;
