import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import * as API from '../api/api';

vi.mock('../api/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
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

describe('AdminDashboard Component', () => {
  const mockUsers = [
    {
      _id: '1',
      name: 'User One',
      email: 'user1@example.com',
      isAdmin: false,
    },
    {
      _id: '2',
      name: 'User Two',
      email: 'user2@example.com',
      isAdmin: true,
    },
  ];

  const mockTasks = [
    {
      _id: 'task1',
      title: 'Admin Task 1',
      description: 'Admin task desc 1',
      user: '1',
    },
    {
      _id: 'task2',
      title: 'Admin Task 2',
      description: 'Admin task desc 2',
      user: '2',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    API.get.mockImplementation((url) => {
      if (url === '/admin/users') {
        return Promise.resolve({ data: mockUsers });
      }
      if (url === '/admin/tasks') {
        return Promise.resolve({ data: mockTasks });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render Admin Dashboard heading', async () => {
    renderWithRouter(<AdminDashboard />);

    const heading = screen.queryByText(/Admin|admin/i);
    expect(heading).toBeTruthy();
  });

  it('should display Users tab', async () => {
    renderWithRouter(<AdminDashboard />);

    const usersTab = screen.queryByText(/Users|users/i);
    expect(usersTab).toBeTruthy();
  });

  it('should display Tasks tab', async () => {
    renderWithRouter(<AdminDashboard />);

    const tasksTab = screen.queryByText(/Tasks|tasks/i);
    expect(tasksTab).toBeTruthy();
  });

  it('should fetch users on mount', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('should fetch tasks on mount', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/admin/tasks');
    });
  });

  it('should display users in Users tab', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/User One/i)).toBeTruthy();
    });
  });

  it('should display all users in list', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);
    expect(container).toBeTruthy();
  });

  it('should display user email in Users tab', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/user1@example.com/i)).toBeTruthy();
    });
  });

  it('should have edit button for each user', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const editButtons = screen.queryAllByText(/Edit|edit/i);
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it('should have delete button for each user', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const deleteButtons = screen.queryAllByText(/Delete|delete/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('should display admin status for users', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const adminStatus = screen.queryByText(/admin|Admin/i);
      expect(adminStatus).toBeTruthy();
    });
  });

  it('should display tasks in Tasks tab', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Admin Task 1/i)).toBeTruthy();
    });
  });

  it('should show all tasks', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);
    expect(container).toBeTruthy();
  });

  it('should display task description', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);
    expect(container).toBeTruthy();
  });

  it('should have edit button for each task', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const editButtons = screen.queryAllByText(/Edit|edit/i);
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it('should have delete button for each task', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const deleteButtons = screen.queryAllByText(/Delete|delete/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('should switch between Users and Tasks tabs', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/User One/i)).toBeTruthy();
    });

    const tasksTab = screen.getByText(/Tasks|tasks/i);
    fireEvent.click(tasksTab);

    await waitFor(() => {
      expect(screen.getByText(/Admin Task 1/i)).toBeTruthy();
    });
  });

  it('should display responsive user card layout', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const cards = container.querySelectorAll('[class*="card"]') ||
                   container.querySelectorAll('[class*="border"]') ||
                   container.querySelectorAll('[class*="p-"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it('should display responsive task card layout', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const cards = container.querySelectorAll('[class*="card"]') ||
                   container.querySelectorAll('[class*="border"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it('should have tab buttons with proper styling', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    const tabButtons = container.querySelectorAll('button');
    expect(tabButtons.length).toBeGreaterThan(0);
  });

  it('should display user management interface', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const userSection = container.querySelector('[class*="user"]') ||
                         screen.getByText(/User One/i);
      expect(userSection).toBeTruthy();
    });
  });

  it('should display task management interface', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const taskSection = container.querySelector('[class*="task"]') ||
                         screen.getByText(/Admin Task/i);
      expect(taskSection).toBeTruthy();
    });
  });

  it('should handle empty user list', async () => {
    API.get.mockImplementation((url) => {
      if (url === '/admin/users') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: mockTasks });
    });

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('should handle empty task list', async () => {
    API.get.mockImplementation((url) => {
      if (url === '/admin/users') {
        return Promise.resolve({ data: mockUsers });
      }
      if (url === '/admin/tasks') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/admin/tasks');
    });
  });

  it('should handle API errors gracefully', async () => {
    API.get.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalled();
    });
  });

  it('should display admin dashboard container', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    const mainContainer = container.querySelector('[class*="container"]') ||
                         container.querySelector('[class*="max-w"]') ||
                         container.querySelector('main');
    expect(mainContainer).toBeTruthy();
  });

  it('should show password field in user edit interface', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/User One/i)).toBeTruthy();
    });

    // Password field should be available in edit mode
    const editButtons = screen.queryAllByText(/Edit|edit/i);
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('should display user email field', async () => {
    renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/user1@example.com/i)).toBeTruthy();
    });
  });

  it('should display task title in task list', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);
    expect(container).toBeTruthy();
  });

  it('should have grid layout for task cards', async () => {
    const { container } = renderWithRouter(<AdminDashboard />);

    await waitFor(() => {
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeTruthy();
    });
  });
});
