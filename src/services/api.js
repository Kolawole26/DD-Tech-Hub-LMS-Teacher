// src/services/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const api = {
  async get(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async post(endpoint, data, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    // Check if data is FormData
    const isFormData = data instanceof FormData;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // Only set Content-Type for JSON, let browser set it for FormData
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      // Only stringify if not FormData
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async patch(endpoint, data, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    // Check if data is FormData
    const isFormData = data instanceof FormData;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async put(endpoint, data, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    // Check if data is FormData
    const isFormData = data instanceof FormData;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async delete(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};