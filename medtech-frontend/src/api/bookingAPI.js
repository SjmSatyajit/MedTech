import API from './axiosConfig';

export const createBooking = (data) =>
  API.post('/bookings', data);

export const getMyBookings = () =>
  API.get('/bookings/my');

export const getHospitalBookings = (hospitalId) =>
  API.get(`/bookings/hospital/${hospitalId}`);

export const getPendingHospitalBookings = (hospitalId) =>
  API.get(`/bookings/hospital/pending/${hospitalId}`);

export const updateBookingStatus = (bookingId, status) =>
  API.put(`/bookings/${bookingId}/status`, null, { params: { status } });
