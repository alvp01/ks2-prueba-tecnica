import { verifyToken } from '../utils/tokenService.js';

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const authMiddleware = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  verifyToken(token)
    .then((payload) => {
      req.token = token;
      req.user = payload;
      return next();
    })
    .catch((error) => {
      return res.status(401).json({ message: error.message || 'Invalid authentication token.' });
    });
};
