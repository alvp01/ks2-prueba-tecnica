import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, updateUser } from '../services/userService';
import { clearAuthSession, getAuthSession, setAuthSession } from '../utils/authStorage';

const normalizeProfileValues = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  password: ''
});

function ProfilePanel({ currentUser, onProfileUpdated }) {
  const navigate = useNavigate();
  const [profileValues, setProfileValues] = useState(() => normalizeProfileValues(currentUser));
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [deletingProfile, setDeletingProfile] = useState(false);

  useEffect(() => {
    setProfileValues((current) => ({
      ...normalizeProfileValues(currentUser),
      // Keep what the user is typing in password only until save cycle finishes.
      password: current.password
    }));
  }, [currentUser?.id, currentUser?.name, currentUser?.email]);

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

    const nextName = profileValues.name.trim();
    const nextEmail = profileValues.email.trim();
    const hasPasswordUpdate = Boolean(profileValues.password.trim());
    const hasProfileChanges = nextName !== (currentUser.name || '') || nextEmail !== (currentUser.email || '');

    if (!hasProfileChanges && !hasPasswordUpdate) {
      setProfileError('');
      setProfileMessage('No hay cambios por guardar.');
      return;
    }

    setProfileSaving(true);
    setProfileError('');
    setProfileMessage('');

    try {
      const payload = {
        name: nextName,
        email: nextEmail
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

      setProfileMessage('Perfil actualizado correctamente.');
      onProfileUpdated(updatedUser);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'No se pudo actualizar el perfil.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!currentUser?.id || deletingProfile) {
      return;
    }

    const confirmed = window.confirm('Eliminar tu perfil? Esto tambien eliminara todos los inmuebles vinculados a tu cuenta.');

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
      setProfileError(error.response?.data?.message || 'No se pudo eliminar el perfil.');
      setDeletingProfile(false);
    }
  };

  return (
    <section className="dashboard-profile">
      <h2 className="dashboard-profile__title">Perfil</h2>

      <form className="dashboard-profile__form" onSubmit={handleProfileSave}>
        <label>
          <span>Nombre</span>
          <input
            type="text"
            value={profileValues.name}
            onChange={(event) => handleProfileFieldChange('name', event.target.value)}
            required
          />
        </label>

        <label>
          <span>Correo</span>
          <input
            type="email"
            value={profileValues.email}
            onChange={(event) => handleProfileFieldChange('email', event.target.value)}
            required
          />
        </label>

        <label>
          <span>Nueva contrasena (opcional)</span>
          <input
            type="password"
            value={profileValues.password}
            onChange={(event) => handleProfileFieldChange('password', event.target.value)}
            placeholder="Dejalo en blanco para mantener la contrasena actual"
          />
        </label>

        {profileError ? <p className="dashboard-profile__error">{profileError}</p> : null}
        {profileMessage ? <p className="dashboard-profile__success">{profileMessage}</p> : null}

        <div className="dashboard-profile__actions">
          <button type="submit" disabled={profileSaving || deletingProfile}>
            {profileSaving ? 'Guardando...' : 'Guardar perfil'}
          </button>
          <button
            type="button"
            className="dashboard-profile__delete"
            onClick={handleDeleteProfile}
            disabled={deletingProfile || profileSaving}
          >
            {deletingProfile ? 'Eliminando...' : 'Eliminar perfil'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfilePanel;
