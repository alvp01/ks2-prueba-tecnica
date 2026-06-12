import db from '../models/index.js';

const { House } = db;

const parseHouseId = (idParam) => {
  const houseId = Number(idParam);

  if (!Number.isInteger(houseId) || houseId <= 0) {
    return null;
  }

  return houseId;
};

const normalizeStatus = (status) => {
  if (typeof status !== 'string') {
    return null;
  }

  const normalized = status.toLowerCase().trim();
  return normalized === 'available' || normalized === 'sold' ? normalized : null;
};

const sanitizeHouse = (house) => ({
  id: house.id,
  address: house.address,
  price: house.price,
  status: house.status,
  sellerId: house.sellerId,
  createdAt: house.createdAt,
  updatedAt: house.updatedAt
});

export const listHouses = async (_req, res) => {
  const statusFilter = _req.query.status;
  const where = {};

  if (statusFilter !== undefined) {
    const normalizedStatus = normalizeStatus(statusFilter);

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Status filter must be available or sold.' });
    }

    where.status = normalizedStatus;
  }

  const houses = await House.findAll({
    where,
    order: [['id', 'ASC']],
    attributes: ['id', 'address', 'price', 'status', 'sellerId', 'createdAt', 'updatedAt']
  });

  return res.status(200).json({ houses });
};

export const createHouse = async (req, res) => {
  const { address, price, status } = req.body;

  if (!String(address || '').trim()) {
    return res.status(400).json({ message: 'Address is required.' });
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }

  let normalizedStatus = 'available';

  if (status !== undefined) {
    normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Status must be available or sold.' });
    }
  }

  const house = await House.create({
    address: String(address).trim(),
    price: numericPrice,
    status: normalizedStatus,
    sellerId: req.user.id
  });

  return res.status(201).json({
    message: 'House created successfully.',
    house: sanitizeHouse(house)
  });
};

export const updateHouse = async (req, res) => {
  const houseId = parseHouseId(req.params.id);

  if (!houseId) {
    return res.status(400).json({ message: 'Invalid house id.' });
  }

  const { address, price, status } = req.body;

  if (address === undefined && price === undefined && status === undefined) {
    return res.status(400).json({
      message: 'At least one field is required: address, price, status.'
    });
  }

  const house = await House.findByPk(houseId);

  if (!house) {
    return res.status(404).json({ message: 'House not found.' });
  }

  if (house.sellerId !== req.user.id) {
    return res.status(403).json({ message: 'You can only edit your own houses.' });
  }

  if (address !== undefined) {
    if (!String(address).trim()) {
      return res.status(400).json({ message: 'Address cannot be empty.' });
    }

    house.address = String(address).trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    house.price = numericPrice;
  }

  if (status !== undefined) {
    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Status must be available or sold.' });
    }

    house.status = normalizedStatus;
  }

  await house.save();

  return res.status(200).json({
    message: 'House updated successfully.',
    house: sanitizeHouse(house)
  });
};

export const deleteHouse = async (req, res) => {
  const houseId = parseHouseId(req.params.id);

  if (!houseId) {
    return res.status(400).json({ message: 'Invalid house id.' });
  }

  const house = await House.findByPk(houseId);

  if (!house) {
    return res.status(404).json({ message: 'House not found.' });
  }

  if (house.sellerId !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own houses.' });
  }

  await house.destroy();

  return res.status(200).json({
    message: 'House deleted successfully.'
  });
};
