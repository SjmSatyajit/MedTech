import API from './axiosConfig';

export const getHospitals = () => API.get('/hospitals');

export const getMyHospital = () => API.get('/hospitals/my');

export const getHospitalById = (id) => API.get(`/hospitals/${id}`);

export const getPendingHospitals = () => API.get('/admin/hospitals/pending');

export const approveHospital = (id) => API.put(`/admin/hospitals/${id}/approve`);

export const getAllUsers = () => API.get('/admin/users');
