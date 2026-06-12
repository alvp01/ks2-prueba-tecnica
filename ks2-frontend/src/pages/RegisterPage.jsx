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
      label: 'Full name',
      type: 'text',
      required: true,
      autoComplete: 'name',
      placeholder: 'Jane Doe',
      validate: validateName
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      placeholder: 'you@example.com',
      validate: validateEmail
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      autoComplete: 'new-password',
      placeholder: 'Create a secure password',
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
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthForm
        title="Register"
        description=""
        fields={fields}
        submitLabel="Create account"
        loading={loading}
        serverError={serverError}
        helperText={
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        }
        onSubmit={handleSubmit}
      />
    </PageShell>
  );
}

export default RegisterPage;
