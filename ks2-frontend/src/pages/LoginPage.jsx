import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import PageShell from '../components/PageShell';
import { loginUser } from '../services/authService';
import { setAuthSession } from '../utils/authStorage';
import { validateEmail, validatePassword } from '../utils/validators';

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const fields = [
    {
      name: 'email',
      label: 'Correo',
      type: 'email',
      required: true,
      autoComplete: 'email',
      placeholder: 'you@example.com',
      validate: validateEmail
    },
    {
      name: 'password',
      label: 'Contrasena',
      type: 'password',
      required: true,
      autoComplete: 'current-password',
      placeholder: 'Ingresa tu contrasena',
      validate: validatePassword
    }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    setServerError('');

    try {
      const data = await loginUser(values);
      setAuthSession({ token: data.token, user: data.user });
      navigate('/home', { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.message || 'Error al iniciar sesion. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthForm
        title="Iniciar sesion"
        description=""
        fields={fields}
        submitLabel="Entrar"
        loading={loading}
        serverError={serverError}
        helperText={
          <>
            <p className="mt-1">
              No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link">
                Registrate
              </Link>
            </p>
          </>
        }
        onSubmit={handleSubmit}
      />
    </PageShell>
  );
}

export default LoginPage;
