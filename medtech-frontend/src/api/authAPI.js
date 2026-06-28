import API from './axiosConfig';

export const loginUser = (data) => API.post('/auth/login', data);

export const registerUser = (data) => API.post('/auth/register', data);

export const getMe = () => API.get('/auth/me');

export const forgotPassword = (email) => API.post('/auth/forgot-password', null, { params: { email } });

export const resetPassword = (data) => API.post('/auth/reset-password', data);
