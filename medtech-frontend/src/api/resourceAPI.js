import API from './axiosConfig';

export const getNearbyResources = (lat, lng, radius = 10, type = null) => {
  const params = { lat, lng, radius };
  if (type) params.type = type;
  return API.get('/resources/nearby', { params });
};

export const getHospitalResources = (hospitalId) =>
  API.get(`/resources/hospital/${hospitalId}`);

export const updateQuantity = (resourceId, quantity) =>
  API.put(`/resources/${resourceId}/quantity`, null, { params: { quantity } });

export const addResource = (data) =>
  API.post('/resources', data);
