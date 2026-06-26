// IndCaffe API Integration Utilities
const API_BASE_URL = 'http://localhost:8080/api';

const api = {
    // Basic Authentication
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                return { success: true, data };
            }
            return { success: false, error: data.message || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error or server down' };
        }
    },

    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData) // { username, password, type, name, city, etc. }
            });
            const text = await response.text();
            if (response.ok) {
                return { success: true, message: text };
            }
            return { success: false, error: text };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error or server down' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Helper to get Auth Header
    getAuthHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },

    // Generic GET request
    get: async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: api.getAuthHeaders()
            });
            if (response.status === 401) { api.logout(); return null; }
            return await response.json();
        } catch (error) {
            console.error(`GET ${endpoint} error:`, error);
            return null;
        }
    },

    // Generic POST request
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: api.getAuthHeaders(),
                body: JSON.stringify(data)
            });
            if (response.status === 401) { api.logout(); return null; }
            const result = await response.json();
            return { success: response.ok, data: result };
        } catch (error) {
            console.error(`POST ${endpoint} error:`, error);
            return { success: false, error: 'Network error' };
        }
    }
};

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
}

// User Info Utility
function getUserInfo() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}
