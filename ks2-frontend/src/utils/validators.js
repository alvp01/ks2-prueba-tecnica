export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value?.trim()) {
    return 'Email is required.';
  }

  if (!emailRegex.test(value.trim())) {
    return 'Enter a valid email address.';
  }

  return '';
};

export const validatePassword = (value) => {
  if (!value) {
    return 'Password is required.';
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return '';
};

export const validateName = (value) => {
  if (!value?.trim()) {
    return 'Name is required.';
  }

  if (value.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }

  return '';
};
