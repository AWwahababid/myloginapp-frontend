import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../pages/Signup';

// Mock axios
vi.mock('../../api/api.js', () => ({
  default: {
    post: vi.fn(),
  },
}));

const renderSignup = () => {
  return render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render signup form with all required fields', () => {
    renderSignup();
    
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should render create account heading', () => {
    renderSignup();
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Join us and unlock amazing features')).toBeInTheDocument();
  });

  it('should have login link', () => {
    renderSignup();
    
    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should toggle password visibility', async () => {
    renderSignup();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.queryAllByRole('button').find(btn => 
      btn.querySelector('svg')
    );
    
    if (toggleButton) {
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });

  it('should update name input value', async () => {
    renderSignup();
    
    const nameInput = screen.getByPlaceholderText('Full Name');
    await userEvent.type(nameInput, 'John Doe');
    
    expect(nameInput).toHaveValue('John Doe');
  });

  it('should update email input value', async () => {
    renderSignup();
    
    const emailInput = screen.getByPlaceholderText('Email Address');
    await userEvent.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password input value', async () => {
    renderSignup();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await userEvent.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('should have required attributes on form fields', () => {
    renderSignup();
    
    expect(screen.getByPlaceholderText('Full Name')).toBeRequired();
    expect(screen.getByPlaceholderText('Email Address')).toBeRequired();
    expect(screen.getByPlaceholderText('Password')).toBeRequired();
  });
});
