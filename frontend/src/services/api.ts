import axios from 'axios';
import { FormInputs } from '@/types/customer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  getCustomers: async (page = 1, limit = 50, search = '') => {
    const response = await axios.get(`${API_BASE_URL}/customers`, {
      params: { page, limit, search }
    });
    return response.data;
  },
  getCustomerByPhone: async (phone: string) => {
    const response = await axios.get(`${API_BASE_URL}/customers/${phone}`);
    return response.data;
  },
  saveCustomer: async (data: FormInputs) => {
    return axios.post(`${API_BASE_URL}/customers`, data);
  },
  deleteCustomer: async (id: string) => {
    return axios.delete(`${API_BASE_URL}/customers/${id}`);
  },
  updateCustomer: async (id: string, data: Partial<FormInputs>) => {
    return axios.put(`${API_BASE_URL}/customers/${id}`, data);
  },
  // Dashboard Metrics
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    return response.data;
  },
  getAlerts: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/alerts`);
    return response.data;
  },
  // Auth
  login: async (credentials: Record<string, string>) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },
  // Admin / Backups
  manualBackup: async (force = false) => {
    const response = await axios.post(`${API_BASE_URL}/admin/manual-backup`, { force });
    return response.data;
  },
  getBackupInfo: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/backup-info`);
    return response.data;
  }
};
