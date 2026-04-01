import makeRequest from '../utils/apiClient';

export const authAPI = {
  register: async (userData) => {
    return makeRequest({
      method: 'POST',
      url: '/auth/register',
      data: userData
    });
  },

  login: async (credentials) => {
    return makeRequest({
      method: 'POST',
      url: '/auth/login',
      data: credentials
    });
  },

  changePassword: async (passwordData) => {
    return makeRequest({
      method: 'PUT',
      url: '/auth/change-password',
      data: passwordData
    });
  },

  logout: async () => {
    return makeRequest({
      method: 'POST',
      url: '/auth/logout'
    });
  }
};

