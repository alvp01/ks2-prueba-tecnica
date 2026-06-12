import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, updateUser } from '../services/userService';
import { clearAuthSession, getAuthSession, setAuthSession } from '../utils/authStorage';

function ProfilePanel({ currentUser, onProfileUpdated }) {
  const navigate = useNavigate();
  const [profileValues, setProfileValues] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [deletingProfile, setDeletingProfile] = useState(false);

  const handleProfileFieldChange = (fieldName, value) => {
    setProfileValues((current) => ({
      ...current,
      [fieldName]: value
    }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!currentUser?.id) {
      return;
    }

    setProfileSaving(true);
    setProfileError('');
    setProfileMessage('');

    try {
      const payload = {
        name: profileValues.name,
        email: profileValues.email
      };

      if (profileValues.password.trim()) {
        payload.password = profileValues.password;
      }

      const response = await updateUser(currentUser.id, payload);
      const updatedUser = response.user;

      const session = getAuthSession();
      if (session) {
        setAuthSession({
          ...session,
          user: updatedUser
        });
      }

      setProfileValues((current) => ({
        ...current,
        password: ''
      }));

      setProfileMessage('Profile updated successfully.');
      onProfileUpdated(updatedUser);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Could not update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!currentUser?.id || deletingProfile) {
      return;
    }

    const confirmed = window.confirm(
      'Delete your profile? This will also delete all houses linked to your account.'
    );

    if (!confirmed) {
      return;
    }

    setDeletingProfile(true);
    setProfileError('');

    try {
      await deleteUser(currentUser.id);
      clearAuthSession();
      navigate('/login', { replace: true });
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Could not delete profile.');
      setDeletingProfile(false);
    }
  };

  return (
    <section className="dashboard-profile">
      <h2 className="dashboard-profile__title">Profile</h2>

      <form className="dashboard-profile__form" onSubmit={handleProfileSave}>
        <label>
          <span>Name</span>
          <input
            type="text"
            value={profileValues.name}
            onChange={(event) => handleProfileFieldChange('name', event.target.value)}
            required
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={profileValues.email}
            onChange={(event) => handleProfileFieldChange('email', event.target.value)}
            required
          />
        </label>

        <label>
          <span>New Password (optional)</span>
          <input
            type="password"
            value={profileValues.password}
            onChange={(event) => handleProfileFieldChange('password', event.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </label>

        {profileError ? <p className="dashboard-profile__error">{profileError}</p> : null}
        {profileMessage ? <p className="dashboard-profile__success">{profileMessage}</p> : null}

        <div className="dashboard-profile__actions">
          <button type="submit" disabled={profileSaving || deletingProfile}>
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            className="dashboard-profile__delete"
            onClick={handleDeleteProfile}
            disabled={deletingProfile || profileSaving}
          >
            {deletingProfile ? 'Deleting...' : 'Delete Profile'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfilePanel;
