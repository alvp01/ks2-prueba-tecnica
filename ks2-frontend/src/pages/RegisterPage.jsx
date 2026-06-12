import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import PageShell from '../components/PageShell';
import { registerUser } from '../services/authService';
import { setAuthSession } from '../utils/authStorage';
import { validateEmail, validateName, validatePassword } from '../utils/validators';

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const fields = [
    {
      name: 'name',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      autoComplete: 'name',
      placeholder: 'Ana Perez',
      validate: validateName
    },
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
      autoComplete: 'new-password',
      placeholder: 'Crea una contrasena segura',
      validate: validatePassword
    }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    setServerError('');

    try {
      const data = await registerUser(values);
      setAuthSession({ token: data.token, user: data.user });
      navigate('/home', { replace: true });
    } catch (error) {
      setServerError(error.response?.data?.message || 'Error al registrarse. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthForm
        title="Registro"
        description=""
        fields={fields}
        submitLabel="Crear cuenta"
        loading={loading}
        serverError={serverError}
        helperText={
          <p>
            Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesion
            </Link>
          </p>
        }
        onSubmit={handleSubmit}
      />
    </PageShell>
  );
}

export default RegisterPage;
