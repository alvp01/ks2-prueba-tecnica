export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value?.trim()) {
    return 'El correo es obligatorio.';
  }

  if (!emailRegex.test(value.trim())) {
    return 'Ingresa un correo valido.';
  }

  return '';
};

export const validatePassword = (value) => {
  if (!value) {
    return 'La contrasena es obligatoria.';
  }

  if (value.length < 8) {
    return 'La contrasena debe tener al menos 8 caracteres.';
  }

  return '';
};

export const validateName = (value) => {
  if (!value?.trim()) {
    return 'El nombre es obligatorio.';
  }

  if (value.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres.';
  }

  return '';
};
