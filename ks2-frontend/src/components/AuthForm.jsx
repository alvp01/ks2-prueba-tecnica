import { useMemo, useState } from 'react';

const buildInitialState = (fields) =>
  fields.reduce((acc, field) => {
    acc[field.name] = field.initialValue || '';
    return acc;
  }, {});

function AuthForm({
  title,
  description,
  fields,
  submitLabel,
  helperText,
  onSubmit,
  loading,
  serverError
}) {
  const [values, setValues] = useState(() => buildInitialState(fields));
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const requiredFieldNames = useMemo(
    () => fields.filter((field) => field.required).map((field) => field.name),
    [fields]
  );

  const allRequiredFilled = requiredFieldNames.every((fieldName) => {
    return String(values[fieldName] || '').trim().length > 0;
  });

  const hasPasswordField = fields.some((field) => field.type === 'password');

  const validateField = (field, value) => {
    if (!field.validate) {
      return '';
    }

    return field.validate(value, values);
  };

  const handleChange = (field, value) => {
    setValues((current) => ({ ...current, [field.name]: value }));

    if (errors[field.name]) {
      const fieldError = validateField(field, value);
      setErrors((current) => ({ ...current, [field.name]: fieldError }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = fields.reduce((acc, field) => {
      const value = values[field.name];
      const fieldError = validateField(field, value);
      if (fieldError) {
        acc[field.name] = fieldError;
      }
      return acc;
    }, {});

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(values);
  };

  return (
    <section className="auth-card">
      <div>
        <h1 className="auth-card__title">
          {title}
        </h1>
        {description ? <p className="auth-card__description">{description}</p> : null}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => (
            <label key={field.name} className="auth-field">
              <span className="auth-field__label">{field.label}:</span>
              <input
                type={field.type === 'password' && showPassword ? 'text' : field.type}
                name={field.name}
                value={values[field.name]}
                onChange={(event) => handleChange(field, event.target.value)}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                className="auth-field__input"
              />
              {errors[field.name] ? (
                <span className="auth-field__error">{errors[field.name]}</span>
              ) : null}
            </label>
          ))}

          {hasPasswordField ? (
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
              <span>Show Password</span>
            </label>
          ) : null}

          {serverError ? <p className="auth-server-error">{serverError}</p> : null}

          <button
            type="submit"
            disabled={!allRequiredFilled || loading}
            className="auth-submit"
          >
            {loading ? 'Please wait...' : submitLabel}
          </button>

          {helperText ? <div className="auth-helper">{helperText}</div> : null}
        </form>
      </div>
    </section>
  );
}

export default AuthForm;
