import Cookies from 'js-cookie';

class AuthService {
  constructor() {
    this.baseURL = '/api/auth';
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data.user;
  }

  async register(email, password, name) {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data.user;
  }

  async logout() {
    const response = await fetch(`${this.baseURL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    Cookies.remove('auth-token');
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/me`, {
      credentials: 'include'
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  }

  async updateProfile(updates) {
    const response = await fetch(`${this.baseURL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    const data = await response.json();
    return data.user;
  }

  async refreshToken() {
    const response = await fetch(`${this.baseURL}/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return data.user;
  }
}

export const authService = new AuthService();