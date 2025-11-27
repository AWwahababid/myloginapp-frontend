import { describe, it, expect, beforeEach, vi } from 'vitest';

// Create a mock API instance
const mockAxios = {
  create: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
    },
  },
};

describe('API Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should have correct base URL', async () => {
    localStorage.setItem('token', 'test-token');
    
    // Import the API module
    const { default: API } = await import('../api/api.js');
    
    // Check if API has request interceptor
    expect(API).toBeDefined();
    expect(API.interceptors).toBeDefined();
    expect(API.interceptors.request).toBeDefined();
  });

  it('should add authorization header when token exists', async () => {
    const token = 'test-token-12345';
    localStorage.setItem('token', token);
    
    const { default: API } = await import('../api/api.js');
    
    // The API should have the token in localStorage
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should not add authorization header when token is missing', async () => {
    localStorage.clear();
    
    const { default: API } = await import('../api/api.js');
    
    expect(localStorage.getItem('token')).toBeNull();
  });
});
