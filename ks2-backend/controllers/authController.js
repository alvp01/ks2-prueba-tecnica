import bcrypt from 'bcrypt';
import db from '../models/index.js';
import { generateToken, revokeToken } from '../utils/tokenService.js';

const { User } = db;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(409).json({ message: 'A user with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    isActive: user.isActive
  });

  return res.status(201).json({
    message: 'User registered successfully.',
    token,
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'This user account is inactive.' });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    isActive: user.isActive
  });

  return res.status(200).json({
    message: 'Login successful.',
    token,
    user: sanitizeUser(user)
  });
};

export const logout = async (req, res) => {
  await revokeToken(req.user);

  return res.status(200).json({
    message: 'Logout successful.'
  });
};
