import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

const renderNavbar = (isAdmin = false) => {
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('isAdmin', isAdmin.toString());
  
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should not render navbar when not authenticated', () => {
    localStorage.clear();
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('My Login')).not.toBeInTheDocument();
  });

  it('should render navbar when authenticated as user', () => {
    renderNavbar(false);
    
    expect(screen.getByText('My Login')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tasks/i })).toBeInTheDocument();
  });

  it('should render admin link when authenticated as admin', () => {
    renderNavbar(true);
    
    expect(screen.getByText('My Login')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('should not show profile/tasks links when admin', () => {
    renderNavbar(true);
    
    expect(screen.queryByRole('link', { name: /profile/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /tasks/i })).not.toBeInTheDocument();
  });

  it('should have logout button', () => {
    renderNavbar(false);
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should have hamburger menu on mobile', () => {
    renderNavbar(false);
    
    const menuButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg') && !btn.textContent.includes('Logout')
    );
    
    expect(menuButton).toBeInTheDocument();
  });

  it('should toggle mobile menu', async () => {
    renderNavbar(false);
    
    const menuButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg') && !btn.textContent.includes('Logout')
    );
    
    if (menuButton) {
      fireEvent.click(menuButton);
      expect(screen.getByRole('link', { name: /profile/i })).toBeVisible();
    }
  });

  it('should clear localStorage on logout', async () => {
    renderNavbar(false);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('isAdmin');
  });
});
