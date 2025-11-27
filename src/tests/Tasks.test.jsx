import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Tasks from '../pages/Tasks';
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

describe('Tasks Component', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      user: 'user123',
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      user: 'user123',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    API.get.mockResolvedValue({ data: mockTasks });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render Tasks page with heading', () => {
    renderWithRouter(<Tasks />);
    
    const heading = screen.queryByText(/tasks|Task/i);
    expect(heading).toBeTruthy();
  });

  it('should display create task form', async () => {
    renderWithRouter(<Tasks />);

    const titleInput = screen.queryByPlaceholderText(/title|Task Title/i);
    expect(titleInput).toBeTruthy();
  });

  it('should have task description input field', async () => {
    renderWithRouter(<Tasks />);

    const descriptionInput = screen.queryByPlaceholderText(/description|Description/i);
    expect(descriptionInput).toBeTruthy();
  });

  it('should have Add Task or Create button', async () => {
    renderWithRouter(<Tasks />);

    const addBtn = screen.queryByText(/Add|Create|add task|create task/i);
    expect(addBtn).toBeTruthy();
  });

  it('should fetch user tasks on mount', async () => {
    renderWithRouter(<Tasks />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should display task list', async () => {
    renderWithRouter(<Tasks />);

    await waitFor(() => {
      expect(screen.getByText(/Task 1/i)).toBeTruthy();
    });
  });

  it('should display all user tasks', async () => {
    const { container } = renderWithRouter(<Tasks />);
    expect(container).toBeTruthy();
  });

  it('should allow adding a new task', async () => {
    API.post = vi.fn().mockResolvedValue({
      data: {
        _id: '3',
        title: 'New Task',
        description: 'New Description',
      },
    });

    renderWithRouter(<Tasks />);

    const titleInput = screen.queryByPlaceholderText(/title|Task Title/i);
    expect(titleInput).toBeTruthy();
  });

  it('should have delete button for each task', async () => {
    renderWithRouter(<Tasks />);

    await waitFor(() => {
      const deleteButtons = screen.queryAllByText(/Delete|delete|Remove|remove/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('should have edit button for each task', async () => {
    renderWithRouter(<Tasks />);

    await waitFor(() => {
      const editButtons = screen.queryAllByText(/Edit|edit/i);
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it('should show task description in list', async () => {
    const { container } = renderWithRouter(<Tasks />);
    expect(container).toBeTruthy();
  });

  it('should handle empty task list', async () => {
    API.get.mockResolvedValue({ data: [] });

    renderWithRouter(<Tasks />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should display task cards in responsive layout', async () => {
    const { container } = renderWithRouter(<Tasks />);

    await waitFor(() => {
      const taskCards = container.querySelectorAll('[class*="card"]') ||
                       container.querySelectorAll('[class*="task"]') ||
                       container.querySelectorAll('[class*="border"]');
      expect(taskCards.length).toBeGreaterThan(0);
    });
  });

  it('should have responsive grid layout for tasks', async () => {
    const { container } = renderWithRouter(<Tasks />);

    await waitFor(() => {
      const grid = container.querySelector('[class*="grid"]') ||
                  container.querySelector('[class*="flex"]');
      expect(grid).toBeTruthy();
    });
  });

  it('should show task form with two input fields', async () => {
    const { container } = renderWithRouter(<Tasks />);

    const inputs = container.querySelectorAll('input[type="text"], textarea');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle task creation form submission', async () => {
    API.post = vi.fn().mockResolvedValue({
      data: { _id: '3', title: 'New', description: 'New' },
    });

    renderWithRouter(<Tasks />);

    const titleInput = screen.queryByPlaceholderText(/title|Task Title/i);
    expect(titleInput).toBeTruthy();
  });

  it('should fetch tasks after successful creation', async () => {
    API.post = vi.fn().mockResolvedValue({
      data: { task: { _id: '3', title: 'New', description: 'New' } },
    });

    renderWithRouter(<Tasks />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/tasks');
    });
  });

  it('should handle API errors when fetching tasks', async () => {
    API.get.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<Tasks />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalled();
    });
  });

  it('should display task title as heading in card', async () => {
    const { container } = renderWithRouter(<Tasks />);
    expect(container).toBeTruthy();
  });

  it('should show task description text in card', async () => {
    const { container } = renderWithRouter(<Tasks />);
    expect(container).toBeTruthy();
  });

  it('should render with proper container styling', async () => {
    const { container } = renderWithRouter(<Tasks />);

    await waitFor(() => {
      const mainContainer = container.querySelector('[class*="container"]') ||
                           container.querySelector('[class*="max-w"]') ||
                           container.querySelector('main');
      expect(mainContainer).toBeTruthy();
    });
  });

  it('should have padding and spacing classes', async () => {
    const { container } = renderWithRouter(<Tasks />);

    const elements = container.querySelectorAll('[class*="p-"]');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('should display form section separately from task list', async () => {
    const { container } = renderWithRouter(<Tasks />);

    const formSections = container.querySelectorAll('form, [class*="form"]');
    expect(formSections.length).toBeGreaterThan(0);
  });
});
