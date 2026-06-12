import { useEffect, useMemo, useState } from 'react';

const defaultValues = {
  address: '',
  price: '',
  status: 'available'
};

const normalizeInitialValues = (initialValues) => ({
  address: initialValues?.address || defaultValues.address,
  price: initialValues?.price !== undefined ? String(initialValues.price) : defaultValues.price,
  status: initialValues?.status || defaultValues.status
});

function HouseForm({ mode, initialValues, onSubmit, onCancel, loading, variant = 'panel' }) {
  const [values, setValues] = useState(() => normalizeInitialValues(initialValues));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(normalizeInitialValues(initialValues));
    setErrors({});
  }, [initialValues, mode]);

  const title = mode === 'create' ? 'Crear inmueble' : 'Editar inmueble';
  const submitLabel = mode === 'create' ? 'Crear' : 'Guardar';
  const isInline = variant === 'inline';

  const isValidForSubmit = useMemo(() => {
    return (
      values.address.trim().length > 0 &&
      values.price !== '' &&
      Number.isFinite(Number(values.price)) &&
      Number(values.price) > 0 &&
      (values.status === 'available' || values.status === 'sold')
    );
  }, [values]);

  const handleChange = (field, fieldValue) => {
    setValues((current) => ({ ...current, [field]: fieldValue }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!values.address.trim()) {
      nextErrors.address = 'La direccion es obligatoria.';
    }

    const numericPrice = Number(values.price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      nextErrors.price = 'El precio debe ser un numero positivo.';
    }

    if (values.status !== 'available' && values.status !== 'sold') {
      nextErrors.status = 'El estado debe ser disponible o vendida.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      address: values.address.trim(),
      price: numericPrice,
      status: values.status
    });
  };

  return (
    <section className={`house-form-card${isInline ? ' house-form-card--inline' : ''}`}>
      {!isInline ? (
        <div className="house-form-card__head">
          <h3 className="house-form-card__title">{title}</h3>
        </div>
      ) : null}

      <form className="house-form" onSubmit={handleSubmit} noValidate>
        <label className="house-form__field">
          <span className="house-form__label">Direccion</span>
          <input
            type="text"
            value={values.address}
            onChange={(event) => handleChange('address', event.target.value)}
            className="house-form__input"
            placeholder="123 Avenida Central"
          />
          {errors.address ? <span className="house-form__error">{errors.address}</span> : null}
        </label>

        <label className="house-form__field">
          <span className="house-form__label">Precio</span>
          <input
            type="number"
            min="1"
            value={values.price}
            onChange={(event) => handleChange('price', event.target.value)}
            className="house-form__input"
            placeholder="245000"
          />
          {errors.price ? <span className="house-form__error">{errors.price}</span> : null}
        </label>

        <label className="house-form__field">
          <span className="house-form__label">Estado</span>
          <select
            value={values.status}
            onChange={(event) => handleChange('status', event.target.value)}
            className="house-form__input"
          >
            <option value="available">Disponible</option>
            <option value="sold">Vendida</option>
          </select>
          {errors.status ? <span className="house-form__error">{errors.status}</span> : null}
        </label>

        <div className="house-form__actions">
          <button type="submit" disabled={!isValidForSubmit || loading}>
            {loading ? 'Por favor espera...' : submitLabel}
          </button>
          <button type="button" className="is-secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default HouseForm;
