/**
 * API Client Configuration
 * Centralizes all backend API calls for the CampusNotes frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://campusnotes-backend-o1re.onrender.com/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const apiClient = {
  /**
   * Health Check
   */
  health: async () => {
    return fetch(`${API_BASE_URL.replace('/api/v1', '')}/api/health`).then(r => r.json());
  },

  /**
   * Authentication Endpoints
   */
  auth: {
    register: async (userData: any) => {
      return fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      }).then(r => r.json());
    },

    login: async (email: string, password: string) => {
      return fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      }).then(r => r.json());
    },

    logout: async () => {
      return fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).then(r => r.json());
    },

    profile: async (token: string) => {
      return fetch(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      }).then(r => r.json());
    },
  },

  /**
   * Resource Endpoints
   */
  resources: {
    getAll: async (filters?: any) => {
      const params = new URLSearchParams(filters || {});
      return fetch(`${API_BASE_URL}/resources?${params.toString()}`, {
        credentials: 'include',
      }).then(r => r.json());
    },

    getById: async (id: string) => {
      return fetch(`${API_BASE_URL}/resources/${id}`, {
        credentials: 'include',
      }).then(r => r.json());
    },

    upload: async (formData: FormData, token: string) => {
      return fetch(`${API_BASE_URL}/resources/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: formData,
      }).then(r => r.json());
    },

    delete: async (id: string, token: string) => {
      return fetch(`${API_BASE_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      }).then(r => r.json());
    },

    search: async (query: string) => {
      return fetch(`${API_BASE_URL}/resources/search?q=${query}`, {
        credentials: 'include',
      }).then(r => r.json());
    },
  },

  /**
   * Academic Endpoints
   */
  academic: {
    getBranches: async () => {
      return fetch(`${API_BASE_URL}/academic/branches`, {
        credentials: 'include',
      }).then(r => r.json());
    },

    getSubjects: async (branchId?: string) => {
      const url = branchId 
        ? `${API_BASE_URL}/academic/subjects?branch=${branchId}`
        : `${API_BASE_URL}/academic/subjects`;
      return fetch(url, {
        credentials: 'include',
      }).then(r => r.json());
    },

    getSemesters: async () => {
      return fetch(`${API_BASE_URL}/academic/semesters`, {
        credentials: 'include',
      }).then(r => r.json());
    },
  },

  /**
   * User Endpoints
   */
  users: {
    getLeaderboard: async () => {
      return fetch(`${API_BASE_URL}/users/leaderboard`, {
        credentials: 'include',
      }).then(r => r.json());
    },

    getUserProfile: async (userId: string, token: string) => {
      return fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      }).then(r => r.json());
    },

    updateProfile: async (userId: string, data: any, token: string) => {
      return fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }).then(r => r.json());
    },
  },
};

export default apiClient;
