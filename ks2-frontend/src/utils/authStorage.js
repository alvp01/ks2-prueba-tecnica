const AUTH_KEY = 'ks2-auth-session';

export const getAuthSession = () => {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAuthSession = (session) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => getAuthSession()?.token ?? null;

export const getCurrentUser = () => getAuthSession()?.user ?? null;

export const isAuthenticated = () => Boolean(getToken());
