import api from './api';

export const listHouses = async (status = 'all') => {
  const query = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  const response = await api.get(`/houses${query}`);
  return response.data;
};

export const createHouse = async (payload) => {
  const response = await api.post('/houses', payload);
  return response.data;
};

export const updateHouse = async (id, payload) => {
  const response = await api.put(`/houses/${id}`, payload);
  return response.data;
};

export const deleteHouse = async (id) => {
  const response = await api.delete(`/houses/${id}`);
  return response.data;
};
