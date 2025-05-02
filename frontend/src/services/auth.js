import api from './api';

// Login API call
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
}

