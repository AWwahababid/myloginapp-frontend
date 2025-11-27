import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock axios
vi.mock('../../api/api.js', () => ({
  default: {
    post: vi.fn(),
  },
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form with email and password inputs', () => {
    renderLogin();
    
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render welcome text', () => {
    renderLogin();
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your dashboard')).toBeInTheDocument();
  });

  it('should have signup link', () => {
    renderLogin();
    
    const signupLink = screen.getByRole('link', { name: /create one/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('should toggle password visibility', async () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: '' });
    await userEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should require email and password fields', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    
    // Form validation should prevent submission
    expect(screen.getByPlaceholderText('Email Address')).toBeRequired();
    expect(screen.getByPlaceholderText('Password')).toBeRequired();
  });

  it('should update email input value', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Email Address');
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password input value', async () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await userEvent.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });
});
