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
      autoComplete: 'current-password',
      placeholder: 'Enter your password',
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
      setServerError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthForm
        title="Login"
        description=""
        fields={fields}
        submitLabel="Sign In"
        loading={loading}
        serverError={serverError}
        helperText={
          <>
            <p>
              Forgot{' '}
              <span className="auth-link">Username / Password?</span>
            </p>
            <p className="mt-1">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up
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
