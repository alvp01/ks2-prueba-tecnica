import bcrypt from 'bcrypt';
import db from '../models/index.js';

const { User, House, RevokedToken, sequelize } = db;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const parseUserId = (idParam) => {
  const userId = Number(idParam);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

export const listUsers = async (_req, res) => {
  const users = await User.findAll({
    order: [['id', 'ASC']],
    attributes: ['id', 'name', 'email', 'isActive', 'createdAt', 'updatedAt']
  });

  return res.status(200).json({
    users
  });
};

export const updateUser = async (req, res) => {
  const userId = parseUserId(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user id.' });
  }

  const { name, email, isActive, password } = req.body;

  if (name === undefined && email === undefined && isActive === undefined && password === undefined) {
    return res.status(400).json({
      message: 'At least one field is required: name, email, isActive, password.'
    });
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (email !== undefined && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    user.email = email;
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (isActive !== undefined) {
    user.isActive = Boolean(isActive);
  }

  if (password !== undefined) {
    if (!password) {
      return res.status(400).json({ message: 'Password cannot be empty.' });
    }

    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  return res.status(200).json({
    message: 'User updated successfully.',
    user: sanitizeUser(user)
  });
};

export const deleteUser = async (req, res) => {
  const userId = parseUserId(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user id.' });
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  await sequelize.transaction(async (transaction) => {
    await House.destroy({
      where: { sellerId: userId },
      transaction
    });

    await RevokedToken.destroy({
      where: { userId },
      transaction
    });

    await User.destroy({
      where: { id: userId },
      transaction
    });
  });

  return res.status(200).json({
    message: 'User deleted successfully.'
  });
};
