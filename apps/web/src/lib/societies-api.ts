import { apiClient } from './api-client';

export const getSocieties = async () => {
  const response = await apiClient.get('/societies');
  return response.data;
};

export const getFlats = async (societyId: string) => {
  const response = await apiClient.get(`/societies/${societyId}/flats`);
  return response.data;
};

export const createSociety = async (data: any) => {
  const response = await apiClient.post('/societies', data);
  return response.data;
};

export const createFlat = async (data: any) => {
  const response = await apiClient.post('/societies/flats', data);
  return response.data;
};