const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response;
};

// Auth API
export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const response = await apiRequest('/profile');
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    const response = await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Universities API
export const universitiesAPI = {
  getUniversities: async () => {
    const response = await apiRequest('/universities');
    return response.json();
  },
};

// AI API
export const aiAPI = {
  chat: async (message: string) => {
    const response = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
};
