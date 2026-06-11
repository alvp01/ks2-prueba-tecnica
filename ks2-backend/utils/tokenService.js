import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { RevokedToken } = db;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }

  return secret;
};

export const generateToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      jti: crypto.randomUUID()
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

export const verifyToken = async (token) => {
  const payload = jwt.verify(token, getJwtSecret());

  if (!payload.jti) {
    throw new Error('Invalid authentication token.');
  }

  const revokedToken = await RevokedToken.findOne({
    where: {
      tokenId: payload.jti
    }
  });

  if (revokedToken) {
    throw new Error('Token has been revoked.');
  }

  return payload;
};

export const revokeToken = async (payload) => {
  if (!payload?.jti || !payload?.id || !payload?.exp) {
    throw new Error('Invalid authentication token.');
  }

  await RevokedToken.findOrCreate({
    where: {
      tokenId: payload.jti
    },
    defaults: {
      tokenId: payload.jti,
      userId: payload.id,
      expiresAt: new Date(payload.exp * 1000)
    }
  });
};
