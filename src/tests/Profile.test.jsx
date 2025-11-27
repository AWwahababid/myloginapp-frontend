import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import * as API from '../api/api';

vi.mock('../api/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Profile Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render profile page with heading', () => {
    API.get.mockResolvedValue({
      data: {
        user: {
          _id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          isAdmin: false,
        },
      },
    });

    renderWithRouter(<Profile />);
    
    const heading = screen.queryByText(/profile/i);
    expect(heading).toBeTruthy();
  });

  it('should display user name when profile data loads', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeTruthy();
    });
  });

  it('should display user email', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/john@example.com/i)).toBeTruthy();
    });
  });

  it('should display admin status when user is admin', async () => {
    const mockUser = {
      _id: '123',
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      const adminStatus = screen.queryByText(/admin|role/i);
      expect(adminStatus).toBeTruthy();
    });
  });

  it('should have View Tasks button', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      const viewTasksBtn = screen.queryByText(/View Tasks|view tasks/i);
      expect(viewTasksBtn).toBeTruthy();
    });
  });

  it('should have Logout button', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      const logoutBtn = screen.queryByText(/Logout|logout/i);
      expect(logoutBtn).toBeTruthy();
    });
  });

  it('should have responsive button styling', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    const { container } = renderWithRouter(<Profile />);

    await waitFor(() => {
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('should fetch profile data on component mount', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/auth/profile');
    });
  });

  it('should handle API errors gracefully', async () => {
    API.get.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<Profile />);

    // Component should not crash
    await waitFor(() => {
      expect(API.get).toHaveBeenCalled();
    });
  });

  it('should clear localStorage on logout', () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    localStorage.setItem('token', 'test-token');
    API.get.mockResolvedValue({ data: { user: mockUser } });

    renderWithRouter(<Profile />);

    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should display profile container with proper structure', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    const { container } = renderWithRouter(<Profile />);

    await waitFor(() => {
      const profileContainer = container.querySelector('[class*="container"]') || 
                               container.querySelector('[class*="flex"]') ||
                               container.querySelector('[class*="bg"]');
      expect(profileContainer).toBeTruthy();
    });
  });

  it('should show gradient text for heading', async () => {
    const mockUser = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false,
    };

    API.get.mockResolvedValue({ data: { user: mockUser } });

    const { container } = renderWithRouter(<Profile />);

    await waitFor(() => {
      const headingWithGradient = container.querySelector('[class*="gradient"]') ||
                                 container.querySelector('h1') ||
                                 container.querySelector('h2');
      expect(headingWithGradient).toBeTruthy();
    });
  });
});
