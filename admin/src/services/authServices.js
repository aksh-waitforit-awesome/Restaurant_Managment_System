import API from '../api/axios';

const authService = {
    login: async (credentials) => {
        const response = await API.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await API.post('/auth/register', userData);
        return response.data;
    },

    // Used by Admin/Manager to add staff
    addUser: async (staffData) => {
        const response = await API.post('/auth/add-user', staffData);
        return response.data;
    },

    refresh: async () => {
        const response = await API.get('/auth/refresh');
        return response.data;
    },

    logout: async () => {
        const response = await API.post('/auth/logout');
        return response.data;
    }
}

export default authService;